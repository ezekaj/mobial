/**
 * Health Check Endpoint
 * GET /api/health - Check application and database health
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    environment: {
      status: 'configured' | 'missing_vars';
      missingVars?: string[];
    };
  };
}

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const startTime = Date.now();
  const checks: HealthResponse['checks'] = {
    database: { status: 'down' },
    environment: { status: 'configured' },
  };

  const missingVars: string[] = [];

  // Check required environment variables
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'ENCRYPTION_KEY'];
  for (const envVar of requiredVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    checks.environment = {
      status: 'missing_vars',
      missingVars,
    };
  }

  // Check database connection
  try {
    await db.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    checks.database = {
      status: 'up',
      responseTime,
    };
  } catch (error) {
    checks.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Determine overall health status
  let status: HealthResponse['status'] = 'healthy';
  
  if (checks.database.status === 'down' || checks.environment.status === 'missing_vars') {
    status = 'unhealthy';
  } else if (checks.database.responseTime && checks.database.responseTime > 1000) {
    status = 'degraded';
  }

  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.2.0',
    checks,
  });
}
