var util = require("util")
var os = require('os')
var EventEmitter = require("events").EventEmitter

var Server = require('./Server.js')
var Client = require('./Client.js')
var Node = require('./Node.js')

function Termite(options) {
  EventEmitter.call(this)
  this._options = options || {}
  this._server = new Server(this._options.port)

  var cluster = this._cluster = {}

  var self = this
  this._server.on('node', function(node) {

    var nodeId = node.host() + ':' + node.port()

    self._cluster[nodeId] = {
      node: node,
      valid: false,
      lastContact: new Date()
    }

    node.on('ping', function() {
      this.send('pong', os.hostname() + ':' + self._options.port)
      updateNodeStatus.call(this)
    })

    node.on('pong', updateNodeStatus)
  })

  function updateNodeStatus() {
    // 'this' refers to the node updating its status

    var nodeId = this.host() + ':' + this.port()
    var nodeInfo = cluster[nodeId]
    if(nodeInfo) {

      if(!nodeInfo.valid) {
        self.emit('online', nodeInfo.node)
      }
      nodeInfo.valid = true
      nodeInfo.lastContact = new Date()
      console.log('node', nodeId, 'is valid')
    }
  }
}

util.inherits(Termite, EventEmitter)

Termite.prototype.start = function(callback) {

  var self = this

  this._server.start(function(err, port) {

    if(err) return callback(err, undefined)

    self._options.port = port

    if(self._options.cluster) {
      self._connect(self._options.cluster, function(err) {
        callback(err, port)
      })
    } else {
      callback(undefined, port)
    }
  })

}

Termite.prototype._connect = function(remote, callback) {

  if(!remote) {
    throw new Error('missing remote')
  }
  if(!remote.port) {
    throw new Error('missing remote port')
  }
  if(!remote.host) {
    throw new Error('missing remote host')
  }

  var client = new Client(remote.host, remote.port)

  var self = this
  client.connect(function(err) {
    if(err) callback(err)

    var node = new Node(client)
    self._cluster[remote.host + ':' + remote.port] = node

    node.send('ping', os.hostname() + ':' + self._options.port)

  })
}

module.exports = Termite
