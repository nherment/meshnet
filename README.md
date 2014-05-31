

MeshNet is a node.js library to structure your node processes in a mesh.

It is a foundation on which you can develop highly scalable architectures.


Meshnet provides:

- auto discovery
- multi master mesh
- replicated configuration
- self healing
- distributed task management
- p2p inter-node communications


var MeshNet = require('meshnet')


var mesh = new MeshNet()

mesh.start({
  cluster: {
    host: <remote_host>,
    port: <remote_port>
  }
})

mesh.on('online', function(node) {

})
