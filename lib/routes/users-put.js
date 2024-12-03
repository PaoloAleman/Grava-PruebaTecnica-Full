'use strict';
const {User} = require('../models');
const router = require('express').Router();


async function disableUser(id) {
    return User.findOneAndUpdate({_id: id, enabled: true}, {enabled: false}, {new: true});
}

router.put('/users/:id/disable', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await disableUser(id);
        if (!user) {
            res.status(400).json({message: 'No user with this id and who is disabled'});
        }
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: 'Error retrieving users', error: error.message});
    }
});

module.exports = router;
