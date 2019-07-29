const express = require('express');
const ProfileService = require('./profile-service');
const profileRouter = express.Router();
const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');

//get users profile
profileRouter
.route('/')
.get(requireAuth, jsonBodyParser, (req,res,next)=>{
    const id = req.user.id;
    ProfileService.getProfile(req.app.get('db'),id)
    .then(profile=> {
        return res.json(ProfileService.serializeProfile(profile));
    })
    .catch(next)
})

module.exports = profileRouter;