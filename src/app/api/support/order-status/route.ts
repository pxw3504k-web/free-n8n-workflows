import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order_id' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('support_orders')
      .select('status, amount, currency, created_at')
      .eq('order_no', orderId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      created_at: data.created_at,
    });
  } catch (error) {
    console.error('Error in order-status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


