/**
 * @author mantU
 * @description This is the auth passport module will handle all the authorization module
 */
 const passport = require('passport');
 const localStrategy = require('passport-local').Strategy;
//  const AuthModel = require('../models/AuthDetails');
 const UserModel = require('../models/User');
 const Utils = require('../helpers/utils');
 const JWTstrategy = require('passport-jwt').Strategy;
 const ExtractJWT = require('passport-jwt').ExtractJwt;
//  const Config = require('../config/config');
//  const { getUserByUserId } = require('../models/User');
require('dotenv').config();
 
 passport.use('signup', new localStrategy({ 
         usernameField: 'email', 
         passwordField: 'password' 
     },
       async (email, password, done) => {
             try {
                 return done(null, {username:email,password});
             } catch (error) {
                 return done(error);
             }
       }
     )
 );
 
 passport.use( 'login', new localStrategy({ usernameField: 'email', passwordField: 'password'},
       async (email, password, done) => {
         try {
             const user = await UserModel.getUser({ user_name: email }, [
                 'email', 'first_name', 'last_name', 'login_details', 'address', 'stream', 'mobile', 'role', 'password' , 'status', 'isDeleted'
                ]);

             if(user.length){
                const user_details = user[0];

                let login_attempts = user_details.login_details.max_attempts || 0;
                
                const validate = await Utils.compareTextWithBcryptHash(password, user_details.password);

                // if password is invalid
                if(!validate){
                    // update the user login_details
                    if(login_attempts > process.env.MAX_LOGIN_ATTEMPTS){
                        // do the account inActive and send a response 
                        await UserModel.updateUser({ user_name: email , role: 'User'},{
                            failed_login_attempt: Date.now(),
                            status:0
                        });
                        return done(null, false, { message: 'Sorry your account is in-active. Due to maximum login attempts, please contact with Admin.' });
                    }
                    login_attempts++;
                    // updating the max attempts and failed login time stamp
                    await UserModel.updateUser({ user_name: email, role: 'User' },{
                        'login_details.failed_login_attempt': Date.now(),
                        'login_details.max_attempts': login_attempts
                    });
                    return done(null, false, { message: 'Wrong Password' });
                }
                
                if(!user_details.status){
                    return done(null, false, { message: 'Your account is either blocked or in-active, Please contact with your admin to activate.' });
                }

                if(user_details.isDeleted){
                    return done(null, false, { message: 'Sorry, we can not found your account.' });
                }

                // updating the last login key
                await UserModel.updateUser({ user_name: email },{
                    'login_details.last_login': Date.now(),
                    'login_details.max_attempts': 0,
                    'isLogin': true
                });

                return done(null, user_details, { message: 'Logged in Successfully' });
             }else{
                return done(null, false, { message: 'User name is invalid' });
             }
         } catch (error) {
             console.log(error)
           return done(error);
         }
       }
     )
 );


 passport.use(new JWTstrategy({ secretOrKey: process.env.APP_SECRET, jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()},
       async (token, done) => {
         try {
             return done(null, token.user);
         } catch (error) {
             console.log(error)
             done(error);
         }
       }
     )
 );
 
 