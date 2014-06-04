var engine = require('engine.io');


function Server(port) {
  this._port = port
}


Server.prototype.start = function(callback) {

  if(this._http) setImmediate(callback)

  this._http = require('http').createServer().listen(this._port, function(err) {
    callback(err)
  })

  this._ws = engine.attach(http)

  this._ws.on('connection', function (socket) {
    socket.on('message', function(data) {
    })
    socket.on('close', function() {
    })
  })
}

