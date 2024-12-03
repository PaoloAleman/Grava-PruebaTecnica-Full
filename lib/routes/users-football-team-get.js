'use strict';
const router = require('express').Router();
const {User, FootballTeam} = require('../models');

async function getUsers(footballTeam) {
    return User.find({footballTeam: footballTeam._id});
}

async function getFootballTeamByName(name) {
    return FootballTeam.findOne({name});
}

// eslint-disable-next-line consistent-return
router.get('/users-football-team', async(req, res) => {
    try {
        const {footballTeamName} = req.query;
        if (!footballTeamName) {
            return res.status(404).json({message: 'You have to enter the football team name'});
        }
        const footballTeam = await getFootballTeamByName(footballTeamName);
        if (!footballTeam) {
            return res.status(404).json({message: 'No football team with this name'});
        }
        const users = await getUsers(footballTeam);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving users', error: error.message});
    }
});

module.exports = router;
