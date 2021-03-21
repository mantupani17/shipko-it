const bcrypt = require('bcrypt');


const utils = {
    getTimeSlot: function(){
        let curentDate = new Date();
        let timeSlot = '';
        let time = curentDate.getTime();
        let day = curentDate.getDate();
        let month = curentDate.getMonth()+1;
        let year = curentDate.getFullYear();
        timeSlot += time+day+month+year;
        return timeSlot;
    },

    createBcryptHashValue: async function(text){
        const hash = bcrypt.hash(text, 10);
        return hash;
    },

    compareTextWithBcryptHash: async function(text, encrypted){
        const compare = await bcrypt.compare(text, encrypted);
        return compare;
    }
}


module.exports = utils;