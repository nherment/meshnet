
MeshNet
=======

MeshNet is a node.js library to structure your node processes in a mesh network.
It is a foundation on which you can develop highly scalable architectures.

MeshNet provides:

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

Channels are the core of the mesh network and cover multiple functionalities.
Depending on how it is configured, a channel can be used as

- a pub-sub
- a queue, persisted (resilient to server crash) or not

First one or several channels must be configured. Then Nodes subscribe to a set of channels. Last, Nodes publishes channels.



    mesh.on('channelName', function(message) {

    })


Consensus
=========

MeshNet comes with a consensus protocol. The consensus is used for:

- deciding which nodes misbehave and take them out of the cluster


Protocol
--------

The protocol works as follow:

1. node1 thinks that node2 is down (criteria TBD)
2. node1 asks node3 (picked randomly amongst his connected nodes, excluding node2)
3. node3 checks if node2 is down, report its result to node1
  1. if node1 does not get an answer from node3
    1. if node1 is out of peers to ask, node1 considers himself down. It keeps trying (exponential backoff) to reconnect to all nodes, round robin 1 at a time.
    2. node1 asks node4 (picked randomly amongst his connected nodes, excluding node2 and node3)
  2. if node3 told node1 that node2 is down
    1. If the number of peers seeing node2 down is greater than or equal to ```consensus_treshold```, node1 round robin to all peers and send node2 down status.
    2. Else goto 2
  3. if node3 told node1 that node2 is up
    1. If the number of peers seeing node2 up is greater than ```consensus_treshold```, node1 notifies all nodes that it is going down and resets.


Note: if a node receive a takedown notice, it must disconnect from all nodes.



configuration
=============

[internal1]: http://www.tablesgenerator.com/markdown_tables "generate markdown tables"

| Property           | Default | Possible Values | Description                                                                                                                                                                                                                                    |
|--------------------|---------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| consensus_treshold | 0.5     | number          | The minimum number of peer nodes agreeing to reach a consensus. Can be a integer greater than zero or a decimal between 0 and 1. If the value is ```1``` it means that 100% of the reachable nodes must agree for the consensus to be reached. |
| timeout            | 100     | number          | In millisecond, the maximum timeout for a command to be acknowledged.                                                                                                                                                                          |
