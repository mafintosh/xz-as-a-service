#!/usr/bin/env node

var os = require('os')
var http = require('http')
var proc = require('child_process')
var pump = require('pump')
var mdns = require('multicast-dns')
var argv = require('minimist')(process.argv, {
  alias: {
    port: 'p',
    name: 'n'
  },
  default: {
    port: process.env.PORT || 9927,
    name: 'xz-as-a-service'
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

  if (argv.name === false) return

  var dns = mdns()
  var name = argv.name + '.local'

  dns.on('query', function (query) {
    var qs = query.questions
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i]
      if (q.name === name && (q.type === 'A' || q.type === 'AAAA')) {
        dns.respond({
          answers: answers()
        })
      }
    }

    function answers () {
      var ans = []
      var networks = os.networkInterfaces()

      Object.keys(networks).forEach(function (net) {
        var n = networks[net]
        n.forEach(function (addr) {
          if (!addr.internal) {
            ans.push({type: addr.family === 'IPv4' ? 'A' : 'AAAA', ttl: 120, name: name, data: addr.address})
          }
        })
      })

      if (!ans.length) {
        ans.push({type: 'A', ttl: 120, name: name, data: '127.0.0.1'})
        ans.push({type: 'AAAA', ttl: 120, name: name, data: '::1'})
      }
      return ans
    }
  })
})
