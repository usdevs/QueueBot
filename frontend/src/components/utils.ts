const BACKEND_DEV_URL = 'http://localhost:3000';
const BACKEND_PROD_URL = 'https://queuebot-4nfq.onrender.com';

export function createPath(path: string) {
  return `${import.meta.env.DEV ? BACKEND_DEV_URL : BACKEND_PROD_URL}/${path}`;
}