const passport = require('passport')
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const Utils = require('../helpers/Utils');
var mongoose = require('mongoose');

class UserController {
    static async register(req, res, next){
        try {
            const bodyData = req.body;
            const hashPassword = await Utils.createBcryptHashValue(bodyData.password);
            // user data 
            const user = {
                user_name: bodyData.email,
                first_name:  bodyData.firstName, 
                last_name: bodyData.lastName,
                stream:'',
                mobile: bodyData.mobile,
                email:bodyData.email,
                role:'User',
                status: true,
                address:{
                    state:"",
                    district:"",
                    pincode:"",
                    city:"",
                    address_desc:""
                },
                login_details:{
                    last_login: Date.now(),
                    max_attempts: 0,
                    failed_login_attempt: Date.now()
                },
                password: hashPassword,
                isLogin:true
            }
            // user instance for creating the token
            const user_instance = {
                user_name: user.email,
                first_name:  user.firstName, 
                last_name: user.lastName,
                mobile: bodyData.mobile,
                email:bodyData.email,
                role:'User'
            };
            

            // checking any user is there or not
            const user_count = await UserModel.countUsers({});

            if(!user_count){
                user.role = 'Admin';
                user_instance.role = 'Admin';
            }


            // create the user 
            const created_user = await UserModel.createUser(user);
            var token = null;
            var response = {
                message: 'Sorry failed to register...',
                status : false,
                data: token
            }

            if(created_user){
                // creating the token
                token = jwt.sign({ user: user_instance },process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
                response = {
                    message: 'User Registered Successfuly...',
                    status : true,
                    data: token
                }
            }

            res.status(200);
            res.json(response)
        } catch (error) {

            res.status(500);
            res.json({
                message:'Internal Server Error',
                status : false
            })
        }
    }

    static async login(req, res, next){
        try {
            passport.authenticate('login', async (err, user, info) => {
                try {
                    if (err || !user) {
                        return res.status(201).send({
                            message: info.message,
                            status: false,
                            token:""
                        });
                    }
                    req.login( user, { session: false }, async (error) => {
                        if (error) return next(error);
                        const body = { 
                            user_name: user.email,
                            first_name:  user.first_name, 
                            last_name: user.last_name,
                            mobile: user.mobile,
                            email: user.email,
                            role: user.role
                        };
                        const token = jwt.sign({ user: body }, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
                        res.status(200)
                        return res.json({ token, message: info.message, status:true });
                    });
                } catch (error) {
                    return next(error);
                }
            })(req, res, next);
        } catch (error) {
            // console.log(error)
            res.status(500).send({
                message: 'Internal server error.',
                status: false,
                token:""
            });
        }
    }

    static async profile(req, res, next){
        try {
            if(req.isAuthenticated()){
                return res.status(200).send({
                    message: '',
                    status: true,
                    data: req.user
                });
            }
            return res.status(200).send({
                message: 'Unauthorized access',
                status: false,
                data:''
            });
        } catch (error) {
            res.status(500).send({
                message: 'Internal server error.',
                status: false,
                data:""
            });
        }
        
    }

    static async getAllUsers(req, res, next){
        try {
            const reqData = req.query;
            let page = 0;
            let limit = 10;
            let sort = 'created_at';
            let orderBy = 1;
            let where = {role:'User'};
            let select = '';
            let skip = 0;
            
            if(reqData && reqData.limit){
                limit = parseInt(reqData.limit);
            }

            if(reqData && reqData.filters){
                
            }

            if(reqData && reqData.page){
                page = parseInt(reqData.page);
                skip = page * parseInt(limit);
            }

            if(reqData && reqData.orderBy){
                if(reqData.orderBy == 'desc'){
                    orderBy = 1;
                }else{
                    orderBy = -1;
                }
            }

            if(reqData && reqData.sort){
                sort[reqData.sort] = orderBy;
            }

            if(reqData && reqData.select){
                select = reqData.select.split(',');
            }
            
            let users = await UserModel.getUser(where, select, skip, limit, sort);

            let totalUserCount = await UserModel.countUsers(where);

            res.status(200).send({
                message: '',
                status: true,
                data: users,
                totalRecords: totalUserCount
            });

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Internal server error.',
                status: false,
                data:""
            });
        }
    }

    static async logout(req, res, next){
        try {
            if(req.isAuthenticated()){
                const user = req.user;
                // updating the last login key
                await UserModel.updateUser({ user_name: user.email },{
                    'isLogin': false
                });
                req.logOut();
                res.status(200).send({
                    message: 'Logout successfully.',
                    status: true,
                    data:""
                });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Internal server error.',
                status: false,
                data:""
            });
        }
    }

    static async getUserById(req, res, next){
        try {
            const reqData = req.params;
            if(reqData && reqData.user_id){
                var _id = mongoose.mongo.ObjectId(reqData.user_id);
                var select = ['address'];
                let users = await UserModel.getUser({_id: _id}, select);
                res.status(200).send({
                    message: '',
                    status: true,
                    data: users
                });

            }else{
                res.status(200).send({
                    message: 'Id missing for the requesting user.',
                    status: true,
                    data:[]
                });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Internal server error.',
                status: false,
                data:""
            });
        }
    }

    static async deleteUser(req, res, next){
        try {
            const reqData = req.params;
            if(reqData && reqData.user_id){
                var _id = mongoose.mongo.ObjectId(reqData.user_id);
                let users = await UserModel.updateUser({_id: _id}, {isDeleted:true});
                res.status(200).send({
                    message: 'User deleted successfuully...',
                    status: true,
                    data: users
                });

            }else{
                res.status(200).send({
                    message: 'Id missing for the requesting user.',
                    status: true,
                    data:[]
                });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Internal server error.',
                status: false,
                data:""
            });
        }
    }

    static async updateUser(req, res, next){
        try {
            const reqData = req.params;
            const putData = req.body;
            const updateData = {};
            if(reqData && reqData.user_id){
                var _id = mongoose.mongo.ObjectId(reqData.user_id);

                if(putData && putData.address){
                    updateData['address'] = putData.address;
                }


                let users = await UserModel.updateUser({_id: _id}, updateData);
                res.status(200).send({
                    message: 'User detail updated successfuully...',
                    status: true,
                    data: users
                });

            }else{
                res.status(200).send({
                    message: 'Id missing for the requesting user.',
                    status: true,
                    data:[]
                });
            }

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Internal server error.',
                status: false,
                data:""
            });
        }
    }
}

module.exports = UserController; 