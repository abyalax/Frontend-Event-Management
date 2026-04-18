import * as z from 'zod';

export const envSchema = z.object({
  API_URL: z.string().refine(
    (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'API_URL must be a valid URL' }
  ),
});

export type EnvConfig = z.infer<typeof envSchema>;

export default defineNuxtPlugin((nuxtApp) => {
  const config = nuxtApp.$config;

  const rawEnv = {
    API_URL: config.public.API_URL,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');

    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.') || 'root';
      console.error(`   - ${path}: ${issue.message}`);
    });

    throw new Error('Environment validation failed. Check console for details.');
  }
  console.info('✅ Environment variables validated successfully.');

  return {
    provide: {
      env: result.data,
    },
  };
});
