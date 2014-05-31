
var assert = require('assert')
var Termite = require('../')

describe('Termite', function() {

  it('2 nodes cluster', function(done) {
    var termite1 = new Termite()


    var discoverCount = 0
    function flagDiscovered() {
      discoverCount++
      if(discoverCount == 2) {
        done()
      }
    }


    termite1.start(function(err, port) {

      if(err) return done(err)

      var portTermite1 = port
      var portTermite2

      console.log('TERMITE 1 STARTED ON', port)
      var termite2 = new Termite({
        cluster: {
          host: 'localhost',
          port: portTermite1
        }
      })

      termite2.on('online', function(node) {
        assert.ok(node)
        assert.equal(node.port(), portTermite1)
        flagDiscovered()
      })

      termite1.on('online', function(node) {
        assert.ok(node)
        assert.equal(node.port(), portTermite2)
        flagDiscovered()
      })

      termite2.start(function(err, port) {
        if(err) return done(err)
        portTermite2 = port
      })
    })
  })

})
