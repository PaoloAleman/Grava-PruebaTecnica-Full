'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FootballTeamSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    country: {
        type: String,
        lowercase: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FootballTeam', FootballTeamSchema);
