/**
 * Users
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var User = {

  /**
   * Attributes list for the user
   * @type {Object}
   */
  attributes: {
    password:{
      type:  'string',
      alphanumeric: true,
      required: true,
      minLength: 6
    },
    firstName: {
      type: 'string',
      maxLength: 50,
      minLength: 5,
      required: true
    },
    lastName:{
      type:  'string',
      maxLength: 50,
      minLength: 5,
      required: true
    },
    email: {
      type: 'email',
      unique: true,
      required: true
    }
  },
  
  /**
   * Function that hashes a password
   * @param  {Object}   attrs - user attributes list
   * @param  {Function} next  [description]
   * @return {[type]}         [description]
   */
  
  beforeCreate: function( attrs, next ) {
    var bcrypt = require('bcrypt');
    bcrypt.genSalt( 10, function( err, salt ) {
      if ( err ) return next( err );
      bcrypt.hash( attrs.password, salt, function( err, hash ) {
        if ( err ) return next( err );
        
        attrs.password = hash;
        next();
      });
    });
  }
  
};

module.exports = User;
