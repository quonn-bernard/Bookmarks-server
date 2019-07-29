const xss = require('xss');

const ProfileService = {
    getProfile : (db,id) =>{
        return db
        .from('v_users')
        .select('id','username')
        .where({id})
        .first();
    },
    serializeProfile(profile){
        console.log(profile)
        return {
            id: profile.id,
            username: xss(profile.username)
        };
    }
}

module.exports = ProfileService;