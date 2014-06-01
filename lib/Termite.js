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

  this._cluster = {}

  var self = this
  this._server.on('node', function(node) {
    self._registerNode(node)
  })
}

util.inherits(Termite, EventEmitter)

Termite.prototype._registerNode = function(node) {

  var self = this

  node.on('ping', function() {
    this.send('pong', os.hostname() + ':' + self._options.port)
    updateNodeStatus.call(this)
  })

  node.on('peersRequest', function(callback) {
    callback(self.peers())
  })

  node.on('peers', function(peers) {

    for(var i = 0 ; i < peers.length ; i++) {
      var peer = peers[i]
      if(peer.host === self.host() && peer.port === self.port()) {
        // shouldn't connect to itself
        continue
      }
      if(!self._cluster[peer.host + ':' + peer.port]) {
        self._connect(peer, function(err) {
          if(err) {
            console.error(err)
          }
        })
      }

    }
  })

  node.on('pong', updateNodeStatus)

  function updateNodeStatus() {

    // 'this' refers to the node updating its status

    var nodeId = this.host() + ':' + this.port()

    if(!self._cluster[nodeId]) {

      self._cluster[nodeId] = {
        node: this,
        online: false
      }
    }
    var nodeInfo = self._cluster[nodeId]

    if(nodeInfo) {

      var cameOnline = false
      if(!nodeInfo.online) {
        cameOnline = true
      }
      nodeInfo.online = true
      nodeInfo.lastContact = new Date()
      //console.log('node', nodeId, this.port(), 'is valid')

      if(cameOnline) {
        //console.log('node online', nodeId)
        self.emit('online', this, this.port())
      }
    }
  }
}

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

Termite.prototype.peers = function() {
  var peers = []
  for(var nodeId in this._cluster) {
    var nodeInfo = this._cluster[nodeId]

    if(nodeInfo.online) {
      peers.push({host: nodeInfo.node.host(), port: nodeInfo.node.port()})
    }
  }
  return peers
}

Termite.prototype.port = function() {
  return this._options.port
}

Termite.prototype.host = function() {
  return os.hostname()
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
    self._registerNode(node)

    node.send('ping', self.host() + ':' + self.port())
    node.send('peers', '?')
    callback(undefined)

  })
}

module.exports = Termite
