import { api } from 'encore.dev/api';

export const check = api(
  { method: 'GET', path: '/health', expose: true },
  async (): Promise<{ status: string }> => {
    return { status: 'ok' };
  }
);
