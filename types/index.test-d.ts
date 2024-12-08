import fastifyOpensearch from '..'
import Fastify from 'fastify'
import { expectAssignable, expectType } from 'tsd'
import { Client } from '@opensearch-project/opensearch'

const fastify = Fastify()
fastify.register(fastifyOpensearch, { node: 'https://localhost:9200' })

expectType<boolean>(fastify.isOpensearchClient(fastify.opensearch))
expectType<boolean>(fastify.isOpensearchClient(fastify.opensearch.asyncSearch))
expectType<boolean>(fastify.isOpensearchClient(fastify.opensearch.aasdf))
expectAssignable<(value: any) => value is Client>(fastifyOpensearch.isOpensearchClient)
