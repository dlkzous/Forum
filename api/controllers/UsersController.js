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

  /*
   * Function that lists all the users currently registered
   */
  index: function( req, res ) {
    var usersList = {}; 
    Users.find().exec( function( err, users ) {
        usersList = users;
        return res.view({users: usersList});
    });
  },

  /*
   * Function that handles the singup page 
   */
  signup: function( req, res ) {
    // Get errors from session flash
    res.locals.flash = _.clone(req.session.flash);
    var errorsList = {};
    // Check if there are any validation errors and pass these to the form
    if ( res.locals.flash && res.locals.flash.err && res.locals.flash.err.ValidationError )
    {
        errorsList = res.locals.flash.err.ValidationError;
        return res.view({errors: errorsList, data:res.locals.flash.data});
    } else {
        return res.view({errors: false});
    }
    // Reset flash variables
    req.session.flash = {};
  },

  /*
   * Function that creates a new user
   */
  create: function( req, res, next ) {
    var formData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };

    Users.create( req.params.all(), function userCreated( err, user ) {
      if( err )
      {

        // Handle duplicate email
        if (err.code == 11000) {
          if (err.ValidationError) {
            err.ValidationError.email = true;
          } else {
            err.ValidationError = {
              email: true
            }
          }
        }

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
