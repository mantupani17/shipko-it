const UserController = require('../controllers/UserController');
const route = require('express')();
const passport = require('passport');

route.post('/', passport.authenticate('signup', { session: false }), UserController.register);
route.get('/', passport.authenticate('jwt', { session: false }), UserController.getAllUsers);
route.get('/profile', passport.authenticate('jwt', { session: false }), UserController.profile);
route.get('/logout', passport.authenticate('jwt', { session: false }), UserController.logout);
route.get('/:user_id', passport.authenticate('jwt', { session: false }), UserController.getUserById);
route.put('/:user_id', passport.authenticate('jwt', { session: false }), UserController.updateUser);
route.delete('/:user_id', passport.authenticate('jwt', { session: false }), UserController.deleteUser);
route.post( '/login', UserController.login);
module.exports = route;