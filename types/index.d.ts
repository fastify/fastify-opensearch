import type { FastifyPluginAsync } from 'fastify';
import type { Client, ClientOptions } from '@opensearch-project/opensearch';

declare module 'fastify' {
  interface FastifyInstance {
    opensearch: Client & Record<string, Client>;
    isOpensearchClient(value: unknown): value is Client
  }
}

type FastifyOpensearch = FastifyPluginAsync<fastifyOpensearch.FastifyOpensearchOptions> & {
  isOpensearchClient: (value: any) => value is Client
}

declare namespace fastifyOpensearch {
  export interface FastifyOpensearchOptions extends ClientOptions {
    namespace?: string;
    healthcheck?: boolean;
    client?: Client;
  }

  export const fastifyOpensearch: FastifyOpensearch
  export { fastifyOpensearch as default }
}

declare function fastifyOpensearch(...params: Parameters<FastifyOpensearch>): ReturnType<FastifyOpensearch>
export = fastifyOpensearch
