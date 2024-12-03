'use strict';
const router = require('express').Router();
const {FootballTeam} = require('../models');

async function editFootballTeamCountry(id, newCountry) {
    return FootballTeam.findOneAndUpdate({_id: id}, {country: newCountry}, {new: true});
}

// eslint-disable-next-line consistent-return
router.put('/users-football-team/edit', async(req, res) => {
    try {
        const {id, newCountry} = req.body;

        const footballTeam = await editFootballTeamCountry(id, newCountry);
        if (!footballTeam) {
            return res.status(404).json({message: 'No football team with this name'});
        }
        res.status(200).json(footballTeam);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving users', error: error.message});
    }
});

module.exports = router;
