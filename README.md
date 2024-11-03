# @fastify/opensearch

![CI](https://github.com/fastify/fastify-opensearch/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fastify/opensearch.svg?style=flat)](https://www.npmjs.com/package/@fastify/opensearch)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Fastify plugin for [Opensearch](https://opensearch.org/) for sharing the same ES client in every part of your server.
Under the hood, the official [opensearch](https://www.npmjs.com/package/@opensearch-project/opensearch) module is used.


## Install

```
npm i @fastify/opensearch
```

## Usage
Add it to your project with `register` and you are done!
The plugin accepts the [same options](https://github.com/opensearch-project/opensearch-js/blob/main/index.d.ts#L105) as the client.

```js
const fastify = require('fastify')()

fastify.register(require('@fastify/opensearch'), {
  node: 'https://localhost:9200',
  auth: {
    username: 'admin',
    password: 'admin'
  }
})

fastify.get('/user', async function (req, reply) {
  const { body } = await this.opensearch.search({
    index: 'tweets',
    body: {
      query: { match: { text: req.query.q }}
    }
  })

  return body.hits.hits
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
```

By default, `@fastify/opensearch` will try to ping the cluster as soon as you start Fastify, but in some cases pinging may not be supported due to the user permissions. If you want, you can disable the initial ping with the `healthcheck` option:
```js
fastify.register(require('@fastify/opensearch'), {
  node: 'https://localhost:9200',
  healthcheck: false,
  auth: {
    username: 'admin',
    password: 'admin'
  }
})
```

If you need to connect to different clusters, you can also pass a `namespace` option:
```js
const fastify = require('fastify')()

fastify.register(require('@fastify/opensearch'), {
  node: 'https://localhost:9200',
  namespace: 'cluster1',
  auth: {
    username: 'admin',
    password: 'admin'
  }
})

fastify.register(require('@fastify/opensearch'), {
  node: 'http://localhost:9201',
  namespace: 'cluster2',
  auth: {
    username: 'admin',
    password: 'admin'
  }
})

fastify.get('/user', async function (req, reply) {
  const { body } = await this.opensearch.cluster1.search({
    index: 'tweets',
    body: {
      query: { match: { text: req.query.q }}
    }
  })

  return body.hits.hits
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
```

## Versioning
By default the latest and greatest version of the Opensearch client is used, see the [compatibility](https://www.opensearch.co/guide/en/opensearch/client/javascript-api/current/introduction.html#_compatibility) table to understand if the embedded client is correct for you.
If it is not, you can pass a custom client via the `client` option.
```js
const fastify = require('fastify')()
const { Client } = require('@opensearch-project/opensearch')

fastify.register(require('@fastify/opensearch'), {
  client: new Client({ node: 'https://localhost:9200' })
})

fastify.get('/user', async function (req, reply) {
  const { body } = await this.opensearch.search({
    index: 'tweets',
    body: {
      query: { match: { text: req.query.q }}
    }
  })

  return body.hits.hits
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
})
```

## License

Licensed under [MIT](./LICENSE).
