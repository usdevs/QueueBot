const BACKEND_DEV_URL = 'http://localhost:3000';
const BACKEND_PROD_URL = 'fastify-test-backend-qblzvwa6v-jaxons-projects-5f854f7a.vercel.app';

export function createPath(path: string) {
  return `${import.meta.env.DEV ? BACKEND_DEV_URL : BACKEND_PROD_URL}/${path}`;
}