
Meshnet
=======

MeshNet is a node.js library to structure your node processes in a mesh network.
It is a foundation on which you can develop highly scalable architectures.

Meshnet provides:

- self organizing nodes
- multi master mesh
- replicated configuration
- self healing
- distributed task management
- p2p inter-node communications


Installation
============

    npm install --save meshnet


Basics
======

    var MeshNet = require('meshnet')


    var mesh = new MeshNet()

    mesh.join({
      cluster: {
        host: <remote_host>, // the host and port of the entry point to join the mesh
        port: <remote_port>
      }
    }, function(err) {
      // mesh.port() // the port on which this node is listening
    })

    mesh.on('online', function(node) {
      // Another node came online
      // node.port()
      // node.host()
    })

Functions
=========

channels
--------

meshnet channels are the core of the mesh network and cover multiple functionalities.
Depending on how it is configured, a channel can be used as a pub-sub or for queue execution depending on how the channel is configured.

Nodes subscribe to a set of channels.
