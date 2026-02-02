import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company_name, company_website, budget_range, message, admin_notes } = body;

    // 验证必填字段
    if (!email || !message || !budget_range) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 验证消息长度
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // 验证 budget_range 是否有效
    const validBudgetRanges = ['under-1k', '1k-5k', '5k-10k', '10k-25k', '25k-50k', '50k-plus'];
    if (!validBudgetRanges.includes(budget_range)) {
      return NextResponse.json(
        { error: 'Invalid budget range' },
        { status: 400 }
      );
    }

    // 插入到 custom_workflow_requests 表
    const { data, error } = await supabase
      .from('custom_workflow_requests')
      .insert({
        name: name || null,
        company_name: company_name || null,
        company_website: company_website || null,
        email,
        budget_range,
        message,
        admin_notes: admin_notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting custom workflow request:', error);
      return NextResponse.json(
        { error: 'Failed to submit request', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in advertise contact API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
