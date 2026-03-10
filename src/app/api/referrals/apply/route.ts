import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  requireAuth,
  successResponse,
  errorResponse,
  parseJsonBody,
  AuthError,
} from '@/lib/auth-helpers';

const REFERRAL_CREDIT = 3;

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const body = await parseJsonBody<{ referralCode: string }>(request);
    if (!body?.referralCode) {
      return errorResponse('Referral code is required', 400);
    }

    const { referralCode } = body;

    const codeLookup = await db.systemConfig.findUnique({
      where: { key: `referral_code:${referralCode}` },
    });

    if (!codeLookup) {
      return errorResponse('Invalid referral code', 404);
    }

    const referrerId = codeLookup.value;

    if (referrerId === user.id) {
      return errorResponse('You cannot use your own referral code', 400);
    }

    const alreadyUsed = await db.systemConfig.findUnique({
      where: { key: `referral_used:${user.id}` },
    });

    if (alreadyUsed) {
      return errorResponse('You have already used a referral code', 400);
    }

    await db.systemConfig.create({
      data: {
        key: `referral_used:${user.id}`,
        value: referralCode,
        description: `Referral code used by user ${user.id}`,
      },
    });

    const referrerConfig = await db.systemConfig.findUnique({
      where: { key: `referral:${referrerId}` },
    });

    if (referrerConfig) {
      const [code, totalReferralsStr, totalEarningsStr] = referrerConfig.value.split(':');
      const totalReferrals = (parseInt(totalReferralsStr) || 0) + 1;
      const totalEarnings = (parseFloat(totalEarningsStr) || 0) + REFERRAL_CREDIT;

      await db.systemConfig.update({
        where: { key: `referral:${referrerId}` },
        data: { value: `${code}:${totalReferrals}:${totalEarnings}` },
      });
    }

    const referrerPendingKey = `referral_pending:${referrerId}`;
    const referrerPending = await db.systemConfig.findUnique({
      where: { key: referrerPendingKey },
    });
    const referrerPendingAmount = referrerPending
      ? parseFloat(referrerPending.value) + REFERRAL_CREDIT
      : REFERRAL_CREDIT;

    await db.systemConfig.upsert({
      where: { key: referrerPendingKey },
      update: { value: String(referrerPendingAmount) },
      create: {
        key: referrerPendingKey,
        value: String(referrerPendingAmount),
        description: `Pending referral earnings for user ${referrerId}`,
      },
    });

    const refereePendingKey = `referral_pending:${user.id}`;
    const refereePending = await db.systemConfig.findUnique({
      where: { key: refereePendingKey },
    });
    const refereePendingAmount = refereePending
      ? parseFloat(refereePending.value) + REFERRAL_CREDIT
      : REFERRAL_CREDIT;

    await db.systemConfig.upsert({
      where: { key: refereePendingKey },
      update: { value: String(refereePendingAmount) },
      create: {
        key: refereePendingKey,
        value: String(refereePendingAmount),
        description: `Pending referral earnings for user ${user.id}`,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'referral_applied',
        entity: 'referral',
        entityId: referralCode,
        newValues: JSON.stringify({
          referralCode,
          referrerId,
          refereeId: user.id,
          credit: REFERRAL_CREDIT,
        }),
      },
    });

    return successResponse(
      { credit: REFERRAL_CREDIT },
      `Referral code applied! You and your friend both get $${REFERRAL_CREDIT}`
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message, error.statusCode);
    }
    console.error('Apply referral error:', error);
    return errorResponse('Failed to apply referral code', 500);
  }
}
