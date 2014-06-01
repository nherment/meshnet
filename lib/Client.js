var net = require('net')
var util = require('util')
var EventEmitter = require('events').EventEmitter

function Client(remoteAddress, remotePort) {
  EventEmitter.call(this)
  this.remoteAddress = remoteAddress
  this.remotePort = remotePort
}

util.inherits(Client, EventEmitter)

Client.prototype.connect = function(callback) {

  if(this._client) {
    throw new Error('client already connected')
  }

  this._client = new net.Socket()

  var self = this

  this._client.on('data', function(data) {
    self.emit('data', data)
  })

  this._client.on('close', function() {
    self.emit('close')
  })


  //console.log('connecting to remote', self.remoteAddress, ':', self.remotePort)
  this._client.connect(self.remotePort, self.remoteAddress, function(err) {

    //console.log('connected to remote', self.remoteAddress, ':', self.remotePort)

    callback(err)

  });

}

Client.prototype.write = function() {
  this._client.write.apply(this._client, arguments)
}

module.exports = Client
