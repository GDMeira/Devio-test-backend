import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

function checkEnv(): string {
  if (process.env.NODE_ENV === 'test') {
    return '.env.test';
  }
  if (process.env.NODE_ENV === 'development') {
    return '.env.development';
  }
  return '.env';
}

export function loadEnv() {
  const path = checkEnv();

  const currentEnvs = dotenv.config({ path });
  dotenvExpand.expand(currentEnvs);
}
