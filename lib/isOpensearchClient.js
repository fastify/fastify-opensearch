'use strict'

const { Client } = require('@opensearch-project/opensearch')

module.exports = function isOpensearchClient (value) {
  return value instanceof Client
}
