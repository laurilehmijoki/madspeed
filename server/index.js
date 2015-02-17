require('events').EventEmitter.defaultMaxListeners = 5000
var express = require('express')
var port = process.env.PORT || 3000
var server = express()
var http = require('http').Server(server)
var path = require('path')

server.use(function(req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0')
  next()
})

server.use('/', express.static(path.resolve(__dirname + '/../client')))

http.listen(port, function() {
  console.log('Started server at http://localhost:' + port)
})
