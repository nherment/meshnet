
var assert = require('assert')
var Mesh = require('../')

describe('Mesh', function() {

  var node1 = new Mesh()
  var node2
  var node3

  var portnode1
  var portnode2
  var portnode3

  before(function(done) {

    var discoverCount = 0
    function flagDiscovered() {
      discoverCount++
      if(discoverCount == 6) {
        done()
      }
    }

    node1.join(function(err, port) {

      if(err) return done(err)

      //console.log('t1 joined', port)

      portnode1 = port
      portnode2
      portnode3

      node2 = new Mesh({
        cluster: {
          host: 'localhost',
          port: portnode1
        }
      })

      node3 = new Mesh({
        cluster: {
          host: 'localhost',
          port: portnode1
        }
      })

      node1.on('online', function(node) {
        flagDiscovered()
      })

      node2.on('online', function(node) {
        flagDiscovered()
      })

      node3.on('online', function(node) {
        flagDiscovered()
      })

      node2.join(function(err, port) {
        if(err) return done(err)
        //console.log('t2 joined', port)
        portnode2 = port
      })

      node3.join(function(err, port) {
        if(err) return done(err)
        //console.log('t3 joined', port)
        portnode3 = port
      })
    })
  })

  it('attach', function(done) {
    node1.attach('channel1', function(err) {

      if(err) return done(err)

      node2.attch('channel1', function(err) {

        if(err) return done(err)


        node2.attch('channel1', function(err) {

          if(err) return done(err)
          else done()

        })

      })

    })
  })

})
