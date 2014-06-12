
var assert = require('assert')
var Termite = require('../')

describe('Mesh', function() {

  var termite1 = new Termite()
  var termite2
  var termite3

  var portTermite1
  var portTermite2
  var portTermite3

  before(function(done) {

    var discoverCount = 0
    function flagDiscovered() {
      discoverCount++
      if(discoverCount == 6) {
        done()
      }
    }

    termite1.join(function(err, port) {

      if(err) return done(err)

      //console.log('t1 joined', port)

      portTermite1 = port
      portTermite2
      portTermite3

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
        flagDiscovered()
      })

      termite2.on('online', function(node) {
        flagDiscovered()
      })

      termite3.on('online', function(node) {
        flagDiscovered()
      })

      termite2.join(function(err, port) {
        if(err) return done(err)
        //console.log('t2 joined', port)
        portTermite2 = port
      })

      termite3.join(function(err, port) {
        if(err) return done(err)
        //console.log('t3 joined', port)
        portTermite3 = port
      })
    })
  })

  it('Configuration sharing', function(done) {

  })

})
