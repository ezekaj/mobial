import { db } from '@/lib/db';

export async function getAffiliateByCode(code: string) {
  const config = await db.systemConfig.findUnique({
    where: { key: `affiliate:${code}` },
  });
  if (!config) return null;
  try {
    return JSON.parse(config.value) as { status: string; userId: string };
  } catch {
    return null;
  }
}

export async function trackClick(
  affiliateCode: string,
  data: {
    ipAddress: string;
    userAgent: string;
    referrer?: string;
    country?: string;
    deviceId?: string;
  },
  linkCode?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mobial.com';
  const clickId = crypto.randomUUID();

  await db.auditLog.create({
    data: {
      action: 'affiliate_click',
      entity: 'affiliate',
      entityId: affiliateCode,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      newValues: JSON.stringify({
        clickId,
        affiliateCode,
        linkCode,
        referrer: data.referrer,
        country: data.country,
      }),
    },
  });

  return {
    clickId,
    targetUrl: `${baseUrl}/products?ref=${affiliateCode}`,
  };
}
