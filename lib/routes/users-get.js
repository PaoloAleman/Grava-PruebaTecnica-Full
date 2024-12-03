'use strict';
const router = require('express').Router();
const {User} = require('../models');

async function getUsers(enabled, orderBy) {
    let users = User.find(enabled ? {enabled} : {});
    if(orderBy) {
        users.sort({[orderBy] : 1});
    }
    return users;
}

router.get('/users', async(req, res) => {
    try {
        const {enabled, orderBy} = req.query;
        const users = await getUsers(enabled, orderBy);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving users', error: error.message});
    }
});

module.exports = router;
