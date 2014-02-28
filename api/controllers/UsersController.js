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
    req.session.flash = {};
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
  },

  /**
   * Function that handles the login page
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  login: function( req, res ) {

    // Check if user has already been authenticated
    if( !req.session.user ) {

      res.locals.flash = _.clone( req.session.flash );
      req.session.flash = {};

      // Check for any errors
      if ( res.locals.flash && res.locals.flash.err && res.locals.flash.err.ValidationError ) {
        
        errorsList = res.locals.flash.err.ValidationError;
        return res.view({errors: errorsList, data:res.locals.flash.data});
      
      } else if( res.locals.flash && res.locals.flash.err && res.locals.flash.err.ServerError ) {
        
        errorsList = {
          ServerError: res.locals.flash.err.ServerError
        };

        if ( !res.locals.flash.data ) {
          res.locals.flash.data = {
            email: "",
            password: ""
          };
        }
        return res.view({errors: errorsList, data:res.locals.flash.data});
      
      } else {
        return res.view({errors: false});
      }
    } else {
      res.locals.user = _.clone( req.session.user )
      return res.redirect( "Users/index" );
    }

    // Reset flash variables
    req.session.flash = {};
  },

  /**
   * Function that authenticates a user
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  authenticate: function( req, res ) {
    var bcrypt = require('bcrypt');

    // Get the form data
    var formData = {
      email: req.body.email
    };

    // Check for form validation errors
    var formErrors = {
      containsErrors: false
    };

    if( req.body.email == "" ) {
      formErrors.containsErrors = true;
      formErrors.email = true;
    }

    if( req.body.password == "" ) {
      formErrors.containsErrors = true;
      formErrors.password = true;
    }

    if( formErrors.containsErrors )
    {
      req.session.flash = {
          err: {
            ValidationError: formErrors
          },
          data:formData
      };
      return res.redirect('Users/login');
    }

    // Try to retrieve the user
    Users.findOneByEmail( req.body.email ).done( function ( err, user ) {

      if ( err ) {
        req.session.flash = {
          err: {
            ServerError: "DB Error"
          },
          data: formData
        };
        return res.redirect('Users/login');
      }

      if ( user ) {
        bcrypt.compare( req.body.password, user.password, function ( err, match ) {
          if ( err ) {
            req.session.flash = {
              err: {
                ServerError: "Server error"
              },
              data: formData
            };
            return res.redirect('Users/login');
          }

          if ( match ) {
            // password match
            var sessionUser = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email
            }
            req.session.user = sessionUser;
            sails.config.userdata.authenticated = true;
            sails.config.userdata.guest = false;
            sails.config.userdata.user = sessionUser;
            return res.redirect('Users/index');
          } else {
            // invalid password
            if ( req.session.user ) req.session.user = null;
            req.session.flash = {
              err: {
                ServerError: "Invalid password"
              },
              data: formData
            };
            return res.redirect('Users/login');
          }
        });
      } else {
        req.session.flash = {
          err: {
            ServerError: "User not found"
          },
          data: formData
        };
        return res.redirect('Users/login');
      }

      // Reset the flash variables
      req.session.flash = {};

    });
  }
}
module.exports = UsersController;
