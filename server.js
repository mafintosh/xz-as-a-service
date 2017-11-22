#!/usr/bin/env node

var http = require('http')
var proc = require('child_process')
var pump = require('pump')
var argv = require('minimist')(process.argv, {
  alias: {
    port: 'p'
  },
  default: {
    port: process.env.PORT || 9927
  }
})

var server = http.createServer(function (req, res) {
  console.log('Compressing request and piping to response')
  var compress = proc.spawn('xz', ['-e', '-9', '--threads=10', '--stdout'])
  pump(req, compress.stdin)
  pump(compress.stdout, res)
})

server.listen(argv.port, function () {
  console.log(`xz-as-a-service listening on ${server.address().port}`)
})
