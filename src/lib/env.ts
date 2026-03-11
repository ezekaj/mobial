const isProduction = process.env.NODE_ENV === 'production';

const PRODUCTION_REQUIRED = [
  'DATABASE_URL',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'MOBIMATTER_MERCHANT_ID',
  'MOBIMATTER_API_KEY',
  'NEXT_PUBLIC_BASE_URL',
  'ENCRYPTION_KEY',
] as const;

const DEV_REQUIRED = [
  'DATABASE_URL',
  'MOBIMATTER_MERCHANT_ID',
  'MOBIMATTER_API_KEY',
] as const;

const OPTIONAL_VARS = [
  'RESEND_API_KEY',
  'CRON_SECRET',
] as const;

export function validateEnv(): void {
  const errors: string[] = [];
  const required = isProduction ? PRODUCTION_REQUIRED : DEV_REQUIRED;

  for (const name of required) {
    const value = process.env[name];

    if (!value) {
      errors.push(`Missing required env var: ${name}`);
      continue;
    }

    if (isProduction) {
      if (name === 'JWT_SECRET' && (value.includes('dev-secret') || value.includes('default'))) {
        errors.push(`${name} contains an insecure value for production`);
      }

      if (name === 'STRIPE_SECRET_KEY' && value === 'sk_test_51') {
        errors.push(`${name} is set to the bare placeholder value`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  for (const name of OPTIONAL_VARS) {
    if (!process.env[name]) {
      console.warn(`[env] Optional var ${name} is not set`);
    }
  }
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
