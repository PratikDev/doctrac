import { NextResponse } from 'next/server';

// CRITICAL: Ensure the health check is never cached by Next.js or CDNs
export const dynamic = 'force-dynamic'; 

export async function GET() {
    return NextResponse.json(
      { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime() 
      },
    );
}
