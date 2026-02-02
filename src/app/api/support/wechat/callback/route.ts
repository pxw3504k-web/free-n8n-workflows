import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const WECHAT_API_KEY = process.env.WECHAT_API_KEY;

// 验证微信回调签名
function verifyCallback(data: Record<string, string>): boolean {
  if (!WECHAT_API_KEY) return false;

  const sign = data.sign;
  if (!sign) return false;

  const params = { ...data };
  delete params.sign;

  const sortedParams = Object.keys(params)
    .filter(key => params[key])
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const stringSignTemp = `${sortedParams}&key=${WECHAT_API_KEY}`;
  const calculatedSign = crypto
    .createHash('md5')
    .update(stringSignTemp, 'utf8')
    .digest('hex')
    .toUpperCase();

  return calculatedSign === sign;
}

// XML 转对象
function xmlToDict(xml: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /<(\w+)><!\[CDATA\[(.*?)\]\]><\/\1>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    result[match[1]] = match[2];
  }
  return result;
}

// 对象转 XML
function dictToXml(params: Record<string, string>): string {
  return `<xml><return_code><![CDATA[${params.return_code}]]></return_code><return_msg><![CDATA[${params.return_msg}]]></return_msg></xml>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const callbackData = xmlToDict(body);

    // 验证签名
    if (!verifyCallback(callbackData)) {
      console.error('Invalid WeChat callback signature');
      return new NextResponse(
        dictToXml({ return_code: 'FAIL', return_msg: 'Invalid signature' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/xml' },
        }
      );
    }

    // 检查支付结果
    if (
      callbackData.return_code === 'SUCCESS' &&
      callbackData.result_code === 'SUCCESS'
    ) {
      const orderNo = callbackData.out_trade_no;
      const wechatOrderId = callbackData.transaction_id;

      // 更新订单状态
      const { error } = await supabase
        .from('support_orders')
        .update({
          status: 'paid',
          wechat_order_id: wechatOrderId,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('order_no', orderNo)
        .eq('status', 'pending');

      if (error) {
        console.error('Error updating order:', error);
        return new NextResponse(
          dictToXml({ return_code: 'FAIL', return_msg: 'Database error' }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/xml' },
          }
        );
      }

      // 返回成功响应给微信
      return new NextResponse(
        dictToXml({ return_code: 'SUCCESS', return_msg: 'OK' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/xml' },
        }
      );
    }

    // 支付失败
    return new NextResponse(
      dictToXml({ return_code: 'SUCCESS', return_msg: 'OK' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/xml' },
      }
    );
  } catch (error) {
    console.error('Error in WeChat callback:', error);
    return new NextResponse(
      dictToXml({ return_code: 'FAIL', return_msg: 'Server error' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/xml' },
      }
    );
  }
}


