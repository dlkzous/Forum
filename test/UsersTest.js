var assert = require('assert')
  , Sails = require('sails')
  , barrels = require('barrels')
  , fixtures;

// Global before hook
before(function (done) {
  // Lift Sails with test database
  Sails.lift({
    log: {
      level: 'error'
    },
    adapters: {
      default: 'mongo'
    }
  }, function(err, sails) {
    if (err)
      return done(err);
    // Load fixtures
    barrels.populate(function(err) {
      done(err, sails);
    });
    // Save original objects in `fixtures` variable
    fixtures = barrels.objects;
  });
});

// Global after hook
after(function (done) {
  console.log();
  sails.lower(done);
});

// User test
describe('Users', function(done) {
  it("should be able to create", function(done) {
    Users.create({firstName: "johnny", lastName: "BeGood", email: "johnnybegood@example.com", password: "validpassword123"}, function(err, user) {
      assert.notEqual(user, undefined);
      done();
    });
  });

  it("should be able to destroy", function(done) {
    Users.destroy({email: "johnnybegood@example.com"}, function(err) {
      Users.find({email: "johnnybegood@example.com"}, function(err, user) {
        assert.deepEqual(user, []);
      });
      done();
    });
  });
});