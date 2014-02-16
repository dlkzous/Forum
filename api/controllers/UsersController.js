/**
 * UsersController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var UsersController = {

  index: function( req, res ) {
    var usersList = {}; 
    Users.find().exec( function( err, users ) {
        usersList = users;
        return res.view({users: usersList});
    });
  },

  signup: function( req, res ) {
    res.locals.flash = _.clone(req.session.flash);
    var errorsList = {};
    if ( res.locals.flash && res.locals.flash.err && res.locals.flash.err.ValidationError )
    {
        errorsList = res.locals.flash.err.ValidationError;
        return res.view({errors: errorsList, data:res.locals.flash.data});
    } else {
        return res.view({errors: false});
    }
    req.session.flash = {};
  },

  create: function( req, res, next ) {
    var formData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };
    Users.create( req.params.all(), function userCreated( err, user ) {
      if( err )
      {
        console.log( err );
          req.session.flash = {
              err: err,
              data:formData
          };
        return res.redirect('Users/signup');
      }
      return res.redirect("Users/index");
      req.session.flash = {};
    });
  }
}
module.exports = UsersController;
