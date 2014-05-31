
var util = require('util')
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

  console.log(cmd)
  this._socket.write(cmd + '::' + attrs + '\n')

}

Node.prototype.host = function() {
  return this._socket.remoteAddress
}

Node.prototype.port = function() {
  return this._socket.remotePort
}

Node.prototype._processInboundStream = function(str) {
  var data = str.split('\n')
  console.log(data)

  if(data.length > 1) {

    for(i = 0 ; i < data.length-1 ; i++) {


      var dataItem = data[i].split('::')

      if(dataItem.length === 2) {

        this._processCommand(dataItem[0], dataItem[1])

      } else {

        console.log('discarding data', data[i])

      }
    }

    return data[data.length-1]

  } else {
    return ''
  }
}

Node.prototype._processCommand = function(cmd, attrs) {
  console.log('received command', cmd, attrs)
  switch(cmd) {

    case 'pong':
    case 'ping':
      var remoteData = attrs.split(':')
      var remote = {
        host: remoteData[0],
        port: Number(remoteData[1])
      }
      this.emit(cmd)
      break

    default:
      break
  }
}

module.exports = Node
