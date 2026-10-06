import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request) {
  try {
    const { message } = await request.json();

    const workflowUrl =
      process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WORKFLOW_URL;

    if (!workflowUrl) {
      return NextResponse.json(
        { error: 'N8N_WEBHOOK_URL or NEXT_PUBLIC_N8N_WORKFLOW_URL is missing.' },
        { status: 400 }
      );
    }

    const requestPayload = {
      message: message || 'demo-trigger',
      source: 'n8n-demo-dashboard',
      triggeredAt: new Date().toISOString(),
    };

    const n8nResponse = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
      cache: 'no-store',
    });

    const rawBody = await n8nResponse.text();
    let parsedBody = rawBody;

    try {
      parsedBody = JSON.parse(rawBody);
    } catch (error) {
      parsedBody = rawBody || { message: 'No response body returned' };
    }

    const status = n8nResponse.ok ? 'success' : 'error';

    const supabaseAdmin = getSupabaseAdminClient();

    if (supabaseAdmin) {
      await supabaseAdmin.from('requests').insert({
        message: requestPayload.message,
        status,
        workflow_url: workflowUrl,
        request_payload: requestPayload,
        response_data: parsedBody,
      });
    }

    return NextResponse.json({
      ok: true,
      status,
      workflowUrl,
      response: parsedBody,
    });
  } catch (error) {
    console.error('Workflow trigger failed:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to trigger workflow' },
      { status: 500 }
    );
  }
}
