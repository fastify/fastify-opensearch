'use strict'

const fp = require('fastify-plugin')
const { Client } = require('@opensearch-project/opensearch')
const isOpensearchClient = require('./lib/isOpensearchClient')

async function fastifyOpensearch (fastify, options) {
  const { namespace, healthcheck } = options
  delete options.namespace
  delete options.healthcheck

  const client = options.client || new Client(options)

  if (healthcheck !== false) {
    await client.ping()
  }

  if (namespace) {
    if (!fastify.opensearch) {
      fastify.decorate('opensearch', {})
    }

    if (fastify.opensearch[namespace]) {
      throw new Error(`Opensearch namespace already used: ${namespace}`)
    }

    fastify.opensearch[namespace] = client

    fastify.addHook('onClose', async (instance) => {
      // v8 client.close returns a promise and does not accept a callback
      await instance.opensearch[namespace].close()
    })
  } else {
    fastify
      .decorate('opensearch', client)
      .addHook('onClose', async (instance) => {
        await instance.opensearch.close()
      })
  }
}

module.exports = fp(fastifyOpensearch, {
  fastify: '5.x',
  name: '@fastify/opensearch'
})
module.exports.default = fastifyOpensearch
module.exports.fastifyOpensearch = fastifyOpensearch

module.exports.isOpensearchClient = isOpensearchClient
