const { Schema, model } = require('mongoose');

const guildSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: null
    },
    welcomeChannel: {
        type: String,
        required: false,
        default: null
    },
    welcomeMessage: {
        type: String,
        required: false,
        default: '{member} a rejoint le serveur ! Grâce à toi nous sommes désormais **{member-count}** !'
    },
    welcomeRole: {
        type: String,
        required: false,
        default: null
    },
    modRole: {
        type: String,
        required: false,
        default: null
    },
    statsChannel: {
        type: String,
        required: false,
        default: null
    },
    logsChannel: {
        type: String,
        required: false,
        default: null
    },
    ticketParent: {
        type: String,
        required: false,
        default: null
    },
    tickets: [{
        user: {
            type: String,
            required: true,
            default: null
        },
        channel: {
            type: String,
            required: true,
            default: null
        }
    }]
});

const Guild = model('Guild', guildSchema);

module.exports = Guild;