
var util = require('util')
var _ = require('lodash')

var EventEmitter = require('events').EventEmitter

function Node(socket) {
  EventEmitter.call(this)

  this._socket = socket

  var self = this

  var cachedInboundData = ''
  socket.on('data', function(data) {
    cachedInboundData += data.toString('utf8')
    data = self._processInboundStream(cachedInboundData)
  })

  socket.on('close', function(data) {
    console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort)
  })
}

util.inherits(Node, EventEmitter)

Node.prototype.send = function(cmd, attrs) {

  if(!_.isString(attrs) && _.isObject(attrs)) {
    attrs = JSON.stringify(attrs)
  }

  this._socket.write(cmd + '::' + attrs + '\n')

}

Node.prototype.host = function() {
  return this._remoteHost
}

Node.prototype.port = function() {
  return this._remotePort
}

Node.prototype._processInboundStream = function(str) {
  var data = str.split('\n')

  if(data.length > 1) {

    for(i = 0 ; i < data.length-1 ; i++) {

      var dataItem = data[i].split('::')

      if(dataItem.length === 2) {

        this._processCommand(dataItem[0], dataItem[1])

      } else {

        console.error('discarding data', data[i])

      }
    }

    return data[data.length-1]

  } else {
    return ''
  }
}

Node.prototype._processCommand = function(cmd, attrs) {
  var self = this
  switch(cmd) {

    case 'pong':
    case 'ping':
      var remoteData = attrs.split(':')
      this._remoteHost = remoteData[0]
      this._remotePort = Number(remoteData[1])

      this.emit(cmd)
      break

    case 'peers':

      // should receive '?' for a request or an array of peers data for a response
      if(!attrs || attrs === '?') {
        this.emit('peersRequest', function(peers) {
          if(peers && peers.length > 0) {
            self.send('peers', peers)
          }
        })
      } else {
        try {
          var peers = JSON.parse(attrs)
          this.emit('peers', peers)
        } catch(parseError) {
          console.error(parseError)
        }
      }
      break

    default:
      break
  }
}

module.exports = Node
