'use strict'

const { test } = require('node:test')
const { Client } = require('@opensearch-project/opensearch')
const Fastify = require('fastify')
const fastifyOpensearch = require('..')
const isOpensearchClient = require('..').isOpensearchClient

test('with reachable cluster', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyOpensearch, { node: 'http://localhost:9200' })

  await fastify.ready()
  t.assert.deepStrictEqual(fastify.opensearch.name, 'opensearch-js')
})

test('with unreachable cluster', t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyOpensearch, { node: 'http://localhost:9201' })

  return t.assert.rejects(fastify.ready())
})

test('with unreachable cluster and healthcheck disabled', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyOpensearch, {
    node: 'http://localhost:9201',
    healthcheck: false
  })

  await fastify.ready()
  t.assert.deepStrictEqual(fastify.opensearch.name, 'opensearch-js')
})

test('namespaced', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyOpensearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  await fastify.ready()
  t.assert.deepStrictEqual(fastify.opensearch.cluster.name, 'opensearch-js')
  t.assert.deepStrictEqual(isOpensearchClient(fastify.opensearch), false)
  t.assert.deepStrictEqual(isOpensearchClient(fastify.opensearch.cluster), true)
  await fastify.close()
})

test('namespaced (errored)', async t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyOpensearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  fastify.register(fastifyOpensearch, {
    node: 'http://localhost:9200',
    namespace: 'cluster'
  })

  await t.assert.rejects(fastify.ready())
})

test('custom client', async t => {
  const client = new Client({
    node: 'http://localhost:9200',
    name: 'custom'
  })

  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyOpensearch, { client })

  await fastify.ready()
  t.assert.deepStrictEqual(isOpensearchClient(fastify.opensearch), true)
  t.assert.deepStrictEqual(fastify.opensearch.name, 'custom')
  await fastify.close()
})

test('Missing configuration', t => {
  const fastify = Fastify()
  t.after(() => fastify.close())
  fastify.register(fastifyOpensearch)

  return t.assert.rejects(fastify.ready())
})
