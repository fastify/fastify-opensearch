import fastifyOpensearch from '..'
import Fastify from 'fastify'
import { expect } from 'tstyche'
import { Client } from '@opensearch-project/opensearch'

const fastify = Fastify()
fastify.register(fastifyOpensearch, { node: 'https://localhost:9200' })

expect(fastify.isOpensearchClient(fastify.opensearch)).type.toBe<boolean>()
expect(fastify.isOpensearchClient(fastify.opensearch.asyncSearch)).type.toBe<boolean>()
expect(fastify.isOpensearchClient(fastify.opensearch.aasdf)).type.toBe<boolean>()
expect(fastifyOpensearch.isOpensearchClient).type.toBeAssignableTo<
  (value: any) => value is Client
>()
