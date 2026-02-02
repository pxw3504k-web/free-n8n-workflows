import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

// 微信支付配置
const WECHAT_APP_ID = process.env.WECHAT_APP_ID;
const WECHAT_MCH_ID = process.env.WECHAT_MCH_ID;
const WECHAT_API_KEY = process.env.WECHAT_API_KEY;
const WECHAT_NOTIFY_URL = process.env.WECHAT_NOTIFY_URL || 'https://your-domain.com/api/support/wechat/callback';

// 生成签名
function generateSign(params: Record<string, string>, apiKey: string): string {
  // 过滤空值并排序
  const sortedParams = Object.keys(params)
    .filter(key => params[key] && key !== 'sign')
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  const stringSignTemp = `${sortedParams}&key=${apiKey}`;
  return crypto.createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase();
}

// 对象转 XML
function dictToXml(params: Record<string, string>): string {
  const xmlParts = Object.keys(params).map(key => {
    return `<${key}><![CDATA[${params[key]}]]></${key}>`;
  });
  return `<xml>${xmlParts.join('')}</xml>`;
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

// 创建微信支付订单
async function createWeChatOrder(
  orderNo: string,
  amount: number,
  description: string,
  timeExpire: string
): Promise<{ success: boolean; qr_code_url?: string; error?: string }> {
  if (!WECHAT_APP_ID || !WECHAT_MCH_ID || !WECHAT_API_KEY) {
    return { success: false, error: 'WeChat Pay configuration missing' };
  }

  const params: Record<string, string> = {
    appid: WECHAT_APP_ID,
    mch_id: WECHAT_MCH_ID,
    nonce_str: crypto.randomBytes(16).toString('hex'),
    body: description,
    out_trade_no: orderNo,
    total_fee: (amount * 100).toString(), // 转换为分
    spbill_create_ip: '127.0.0.1',
    notify_url: WECHAT_NOTIFY_URL,
    trade_type: 'NATIVE',
    time_expire: timeExpire,
  };

  // 生成签名
  params.sign = generateSign(params, WECHAT_API_KEY);

  // 转换为 XML
  const xml = dictToXml(params);

  try {
    const response = await fetch('https://api.mch.weixin.qq.com/pay/unifiedorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xml,
    });

    const responseText = await response.text();
    console.log('WeChat Pay response:', responseText);
    const result = xmlToDict(responseText);

    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
      return { success: true, qr_code_url: result.code_url };
    } else {
      const errorMsg = result.err_code_des || result.return_msg || 'Failed to create order';
      console.error('WeChat Pay error:', errorMsg, result);
      return {
        success: false,
        error: errorMsg,
      };
    }
  } catch (error) {
    console.error('WeChat Pay API error:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency } = body;

    // 验证金额
    if (!amount || amount < 1 || amount > 100) {
      return NextResponse.json(
        { error: 'Amount must be between 1 and 100' },
        { status: 400 }
      );
    }

    // 生成订单号
    const orderNo = `SP${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // 计算过期时间（至少5分钟后，微信要求扫码支付至少5分钟）
    // 使用本地时间，格式：YYYYMMDDHHmmss
    const now = new Date();
    const expireTime = new Date(now.getTime() + 5 * 60 * 1000); // 5分钟后
    
    // 格式化为微信要求的格式：YYYYMMDDHHmmss（本地时间）
    const year = expireTime.getFullYear();
    const month = String(expireTime.getMonth() + 1).padStart(2, '0');
    const day = String(expireTime.getDate()).padStart(2, '0');
    const hours = String(expireTime.getHours()).padStart(2, '0');
    const minutes = String(expireTime.getMinutes()).padStart(2, '0');
    const seconds = String(expireTime.getSeconds()).padStart(2, '0');
    const timeExpire = `${year}${month}${day}${hours}${minutes}${seconds}`;

    // 创建本地订单记录（订单有效期30分钟，但微信支付至少5分钟）
    const dbExpireTime = new Date();
    dbExpireTime.setMinutes(dbExpireTime.getMinutes() + 30); // 数据库记录30分钟过期
    
    const { data: orderData, error: dbError } = await supabase
      .from('support_orders')
      .insert({
        order_no: orderNo,
        amount: amount,
        currency: currency || 'CNY',
        status: 'pending',
        created_at: new Date().toISOString(),
        expires_at: dbExpireTime.toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // 调用微信支付创建订单
    const wechatResult = await createWeChatOrder(
      orderNo,
      amount,
      'Support Free N8N Project',
      timeExpire
    );

    if (!wechatResult.success) {
      // 更新订单状态为失败
      await supabase
        .from('support_orders')
        .update({ status: 'failed', error_message: wechatResult.error })
        .eq('order_no', orderNo);

      return NextResponse.json(
        { error: wechatResult.error || 'Failed to create payment order' },
        { status: 500 }
      );
    }

    // 更新订单，保存微信订单号
    await supabase
      .from('support_orders')
      .update({
        wechat_order_id: wechatResult.qr_code_url?.split('=')[1] || null,
        qr_code_url: wechatResult.qr_code_url,
      })
      .eq('order_no', orderNo);

    return NextResponse.json({
      success: true,
      order_id: orderNo,
      qr_code_url: wechatResult.qr_code_url,
    });
  } catch (error) {
    console.error('Error in create-order API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

