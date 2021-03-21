const route = require('express')();

route.get('/', function(req, res, next){
    return res.send({data:"hello world"})
})

module.exports = route;