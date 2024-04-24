'use strict'

const { test } = require('tap')
const { Client } = require('@opensearch-project/opensearch')
const Fastify = require('fastify')
const fastifyOpensearch = require('..')
const isOpensearchClient = require('..').isOpensearchClient
const opensearch_host = process.env.OPENSEARCH_HOST ?? 'http://localhost:9200'
const opensearch_wrong_host = process.env.OPENSEARCH_WRONG_HOST ?? 'http://localhost:9201'

test('with reachable cluster', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyOpensearch, { node: opensearch_host })

  await fastify.ready()
  t.equal(fastify.opensearch.name, 'opensearch-js')
})

test('with unreachable cluster', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyOpensearch, { node: opensearch_wrong_host })

  try {
    await fastify.ready()
    t.fail('should not boot successfully')
  } catch (err) {
    t.ok(err)
  }
})

test('with unreachable cluster and healthcheck disabled', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyOpensearch, {
    node: opensearch_wrong_host,
    healthcheck: false
  })

  try {
    await fastify.ready()
    t.equal(fastify.opensearch.name, 'opensearch-js')
  } catch (err) {
    t.fail('should not error')
  }
})

test('namespaced', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyOpensearch, {
    node: opensearch_host,
    namespace: 'cluster'
  })

  await fastify.ready()
  t.strictEqual(fastify.opensearch.cluster.name, 'opensearch-js')
  t.equal(isOpensearchClient(fastify.opensearch), false)
  t.equal(isOpensearchClient(fastify.opensearch.cluster), true)
  await fastify.close()
})

test('namespaced (errored)', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyOpensearch, {
    node: opensearch_host,
    namespace: 'cluster'
  })

  fastify.register(fastifyOpensearch, {
    node: opensearch_host,
    namespace: 'cluster'
  })

  try {
    await fastify.ready()
    t.fail('should not boot successfully')
  } catch (err) {
    t.ok(err)
  }
})

test('custom client', async t => {
  const client = new Client({
    node: opensearch_host,
    name: 'custom'
  })

  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyOpensearch, { client })

  await fastify.ready()
  t.equal(isOpensearchClient(fastify.opensearch), true)
  t.strictEqual(fastify.opensearch.name, 'custom')
  await fastify.close()
})

test('Missing configuration', async t => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())
  fastify.register(fastifyOpensearch)

  try {
    await fastify.ready()
    t.fail('should not boot successfully')
  } catch (err) {
    t.ok(err)
  }
})
