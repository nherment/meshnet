
var util = require('util')
var EventEmitter = require('events').EventEmitter

var net = require('net')
var getAvailablePort = require('get-port')
var Node = require('./Node.js')

function Server(port) {
  EventEmitter.call(this)
  this._port = port
  this._clients = {}
}

util.inherits(Server, EventEmitter)

Server.prototype._getPort = function(callback) {

  if(this._port) {
    return setImmediate(function() {
      callback(undefined, port)
    })
  }

  //console.log('No port explicitely set. Looking for an available one...')

  getAvailablePort(function(err, port) {

    if(err) {

      if(!callback && err) {
        throw err
      }
      callback(err, undefined)

    } else {

      callback(undefined, port)

    }

  })
}


Server.prototype.start = function(callback) {

  var self = this

  this._getPort(function(err, port) {

    if(err) return callback(err, undefined)

    var srv = net.createServer()

    srv.listen(port, function(err) {
     //console.log('Server listening on', port)
     callback(err, port)
    })

    srv.on('connection', function(sock) {

      var sockId = sock.remoteAddress + ':' + sock.remotePort

      //console.log('new client: ', sockId)

      var node = new Node(sock)
      self.emit('node', node)

    })
  })

}


module.exports = Server
