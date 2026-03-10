import { NextRequest } from 'next/server';
import { requireAdmin, successResponse, errorResponse } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';

const ALLOWED_SETTING_KEYS = [
  'setting:store_name',
  'setting:support_email',
  'setting:markup_rate',
  'setting:currency',
  'setting:tax_rate',
  'setting:from_email',
  'last_product_sync',
];

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const settings = await db.systemConfig.findMany({
      where: {
        key: { startsWith: 'setting:' },
      },
    });

    const lastSync = await db.systemConfig.findUnique({
      where: { key: 'last_product_sync' },
    });

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    if (lastSync) {
      settingsMap['last_product_sync'] = lastSync.value;
    }

    return successResponse(settingsMap);
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const authError = error as { statusCode: number; message: string };
      return errorResponse(authError.message, authError.statusCode);
    }
    console.error('Error fetching settings:', error);
    return errorResponse('Failed to fetch settings', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return errorResponse('Invalid request body', 400);
    }

    const updates: Record<string, string> = {};

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_SETTING_KEYS.includes(key)) {
        continue;
      }
      updates[key] = String(value);
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse('No valid settings to update', 400);
    }

    for (const [key, value] of Object.entries(updates)) {
      await db.systemConfig.upsert({
        where: { key },
        update: { value },
        create: {
          key,
          value,
          description: `Admin setting: ${key}`,
        },
      });
    }

    await logAudit({
      userId: user.id,
      action: 'settings_change',
      entity: 'system_config',
      newValues: updates,
    });

    return successResponse(updates, 'Settings saved successfully');
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      const authError = error as { statusCode: number; message: string };
      return errorResponse(authError.message, authError.statusCode);
    }
    console.error('Error saving settings:', error);
    return errorResponse('Failed to save settings', 500);
  }
}
