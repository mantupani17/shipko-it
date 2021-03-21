/**
 * @author mantU
 * @description This module is handling all type of auth handle methods
 */
 const passport = require('passport')
 const jwt = require('jsonwebtoken');
 const UserModel = require('../models/User');
 
 const AuthController = {
     login: function(req, res, next){
         try {
             passport.authenticate('login', async (err, user, info) => {
                 try {
                     if (err || !user) {
                         return res.status(403).send({
                             message: info.message,
                             status: 'FAILED',
                             token:""
                         });
                     }
                     req.login( user, { session: false }, async (error) => {
                         if (error) return next(error);
                         const body = { 
                             name: user.firstname +' '+ user.lastname,
                             id: user.auth_detail_id, 
                             email: user.email, 
                             role: user.user_type, 
                             user_type: user.user_type,
                             user_status: user.user_status,
                             username:user.email
                         };
                         const token = jwt.sign({ user: body }, Config.APP_CONFIG.APP_SECRET, { expiresIn: Config.TOKEN_EXPIRY });
                         return res.json({ token, message: info.message, status:'SUCCESS' });
                     });
                 } catch (error) {
                     return next(error);
                 }
             })(req, res, next);
         } catch (error) {
             // console.log(error)
             res.status(500).send({
                 message: 'Internal server error.',
                 status: 'FAILED',
                 token:""
             });
         }
     },
     logout: function(req, res, next){
         req.logOut();
         res.redirect('/');
     },
     signup: function(req, res, next){
         const bodyData = req.body;
         const user_type = "Student"; // User / Admin
         const user = {
             "user_name": bodyData.username,
             "email": bodyData.email,
             "mobile": bodyData.mobile,
             "first_name": bodyData.first_name,
             "last_name": bodyData.last_name,
             "role": user_type,
             "stream": bodyData.stream,
             "address":{
                 state:"",
                 district:"",
                 pincode:"",
                 city:"",
                 detail:""
             },
             "status" : 1,
             "login_details":{
                 "last_login":"",
                 "login_attempts":0
             },
             password:bodyData.password
         }
         const user_instance = {
             name: user.first_name +' '+ user.last_name,
             user_name: user.user_name, 
             email: user.email, 
             mobile: user.mobile, 
             role: user.role,
             status: user.status
         }
        //  createUser(user, function(err, user){
        //      if(err){
        //          console.log(err)
        //          return res.status(500).send({
        //              message: 'Internal server error',
        //              status: 'FAILED',
        //              data:[]
        //          });
        //      }
        //      const token = jwt.sign({ user: user_instance }, Config.APP_CONFIG.APP_SECRET, { expiresIn: Config.TOKEN_EXPIRY });
        //      return res.status(200).send({
        //          message: 'Signup successful',
        //          status: 'SUCCESS',
        //          data:token
        //      });
        //  });
     },
     updateUserAuth: async function(req, res, next){
         try {
             const bodyData = req.body;
             const where = {}
             const expressionAttrNames = {};
 
             // setting conditions for update
             if(bodyData && bodyData['where'] && bodyData['where'].email){
                 where['username'] =  bodyData['where'].email
                 let updateData = {};
 
                 if(bodyData && bodyData['updateData'] && bodyData['updateData']){
                     updateData = Utils.prepareMultipleUpdateValues(bodyData['updateData']);
                     const result = await AuthModel.updateUserAuth(where, updateData.updateString, expressionAttrNames, updateData.expressionAttrValues);
                     if(!result){
                         return res.status(200).send({
                             message: 'Failed to update the user auth.',
                             status: 'FAILED',
                             data:[]
                         });
                     }
                     return res.status(200).send({
                         message: 'Data updated successfully...',
                         status: 'SUCCESS',
                         data:[]
                     });
                 }else{
                     return res.status(200).send({
                         message: 'Sorry, please provide data to update.',
                         status: 'FAILED',
                         data:[]
                     });
                 }
             }else{
                 return res.status(200).send({
                     message: 'Sorry, please provide the user name.',
                     status: 'FAILED',
                     data:[]
                 });
             }
 
            
             
             
         } catch (error) {
             console.log(error)
             res.status(500).send({
                 message: 'Internal server error',
                 status: 'FAILED',
                 data:[]
             });
         }
     },
     deleteUserAuth: function(req, res, next){
         try {
             let getData = req.body;
             let query = {
                 username: getData.email
             };
             AuthModel.removeUserAuth(query, function(err, message){
                 if(err){
                     return res.status(200).send({
                         message: err,
                         status: 'FAILED',
                         data:[]
                     });
                 }
                 query = {
                     email : getData.email
                 }
                 removeUser(query, function(err, data){
                     if(err){
                         console.log(err)
                     }
                     console.log(data)
                 })
                 return res.status(200).send({
                     message: 'Successfully removed the user.',
                     status: 'SUCCESS',
                     data:[]
                 });
             });
         } catch (error) {
             console.log(error)
             res.status(500).send({
                 message: 'Internal server error',
                 status: 'FAILED',
                 data:[]
             });
         }
     },

 
     isExistUser: function(req, res, next){
         try {
             const getData = req.query;
             AuthModel.getUserAuth({username: getData.username}, function(err, user){
                 if(err){
                     return res.status(200).send({
                         message: err,
                         status: 'FAILED',
                         data:[]
                     });
                 }
                 if(user && user.Item && Object.keys(user.Item).length){
                     return res.status(200).send({
                         message: 'The user is already exist.',
                         status: 'SUCCESS',
                         data:[]
                     });
                 }
                 return res.status(200).send({
                     message: 'User not exist in the system.',
                     status: 'FAILED',
                     data:[]
                 });
             })
             
         } catch (error) {
             console.log(error)
             res.status(500).send({
                 message: 'Internal server error',
                 status: 'FAILED',
                 data:[]
             });
         }
     }


 
 }
 
 module.exports = AuthController