
var assert = require('assert')
var Termite = require('../')

describe('Termite', function() {

//   it('2 nodes cluster', function(done) {
//     var termite1 = new Termite()

//     var discoverCount = 0
//     function flagDiscovered() {
//       discoverCount++
//       if(discoverCount == 2) {
//         done()
//       }
//     }

//     termite1.start(function(err, port) {

//       if(err) return done(err)

//       var portTermite1 = port
//       var portTermite2

//       var termite2 = new Termite({
//         cluster: {
//           host: 'localhost',
//           port: portTermite1
//         }
//       })

//       termite2.on('online', function(node) {
//         assert.ok(node)
//         assert.equal(node.port(), portTermite1, '[termite2] termite1 node has the wrong port')
//         flagDiscovered()
//       })

//       termite1.on('online', function(node, port) {
//         assert.ok(node)
//         assert.equal(node.port(), portTermite2, '[termite1] termite2 node has the wrong port')
//         flagDiscovered()
//       })

//       termite2.start(function(err, port) {
//         if(err) return done(err)
//         portTermite2 = port
//       })
//     })
//   })

  it('3 nodes cluster', function(done) {
    var termite1 = new Termite()
    var termite2
    var termite3

    var discoverCount = 0
    function flagDiscovered() {
      discoverCount++
      if(discoverCount == 6) {

        console.log('t1('+termite1.port()+'):', JSON.stringify(termite1.peers()))
        console.log('t2('+termite2.port()+'):', JSON.stringify(termite2.peers()))
        console.log('t3('+termite3.port()+'):', JSON.stringify(termite3.peers()))

        done()
      }
    }

    termite1.start(function(err, port) {

      if(err) return done(err)

      console.log('t1 started', port)

      var portTermite1 = port
      var portTermite2
      var portTermite3

      termite2 = new Termite({
        cluster: {
          host: 'localhost',
          port: portTermite1
        }
      })

      termite3 = new Termite({
        cluster: {
          host: 'localhost',
          port: portTermite1
        }
      })

      termite1.on('online', function(node) {
        assert.ok(node)
        //console.log('t1: node online', node.host(), typeof node.port(), 't2:'+portTermite2, typeof portTermite2, 't3:'+portTermite3, typeof portTermite3)
        if(node.port() !== portTermite2 && node.port() !== portTermite3) {
          assert.fail('t1: expected t2 or t3 port')
        }
        flagDiscovered()
      })

      termite2.on('online', function(node) {
        assert.ok(node)
        //console.log('t2: node online', node.host(), node.port())
        if(node.port() !== portTermite1 && node.port() !== portTermite3) {
          assert.fail('t2: expected t1 or t3 port')
        }
        flagDiscovered()
      })

      termite3.on('online', function(node) {
        assert.ok(node)
        //console.log('t3: node online', node.host(), node.port())
        if(node.port() !== portTermite1 && node.port() !== portTermite2) {
          assert.fail('t3: expected t1 or t2 port')
        }
        flagDiscovered()
      })

      termite2.start(function(err, port) {
        if(err) return done(err)
        console.log('t2 started', port)
        portTermite2 = port
      })

      termite3.start(function(err, port) {
        if(err) return done(err)
        console.log('t3 started', port)
        portTermite3 = port
      })
    })
  })

})
