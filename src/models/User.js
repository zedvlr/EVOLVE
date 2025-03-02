const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: null
    },
    guildId: {
        type: String,
        required: true,
        default: null
    },
    voiceTime: {
        type: Number,
        required: false,
        default: 0
    },
    messageCount: {
        type: Number,
        required: false,
        default: 0
    },
    sanctions: [{
        type: {
            type: String,
            required: true,
            default: null
        },
        date: {
            type: Date,
            required: true,
            default: null
        },
        mod: {
            type: String,
            required: true,
            default: '1318266861003210822'
        },
        reason: {
            type: String,
            required: false,
            default: 'EVOLVE Security'
        }
    }]
});

const User = model('User', userSchema);

module.exports = User;