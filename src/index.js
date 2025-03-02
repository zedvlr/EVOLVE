const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const token = process.env.TOKEN
const { join } = require('path');
const { readdirSync } = require('fs');
const connectDb = require('./services/db');

const client = new Client({ intents: Object.values(GatewayIntentBits) });

const handlersPath = join(__dirname, 'handlers');
const handlerFiles = readdirSync(handlersPath).filter((file) => file.endsWith('.js'));

for (const file of handlerFiles) {
    const handlerPath = join(handlersPath, file);
    const handler = require(handlerPath);
    handler(client);
}

connectDb().catch(() => {
    console.error('[ERROR] Failed to connect database!'.red);
});

client.login(token);