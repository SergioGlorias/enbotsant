import { Client, GatewayIntentBits as Intents, Partials, Events } from 'discord.js';
import { exit } from 'process';

import log from './lib/log';
import { getMessageData } from './engine/message-util';
import pluginsProduction from './plugins.production';
import { withUser, forEachPlugin } from './engine/message-handlers';

require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

if (!DISCORD_BOT_TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN');
  exit(1);
}

const client = new Client({
  intents: [Intents.Guilds, Intents.GuildMessages, Intents.MessageContent],
  partials: [Partials.Message, Partials.Channel],
});

let plugins = pluginsProduction;
try {
  plugins = require('./plugins.local').default;
} catch (e) {}
log(`Loaded ${plugins.length} plugins`);

client.on(Events.ClientReady, () => {
  log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || message.channel.isDMBased()) {
    // Skip bot & DM messages
    return;
  }

  return withUser(message, async (user, updateUser) => {
    const messageData = getMessageData(message, user);
    if (!messageData) {
      return;
    }

    await forEachPlugin(
      plugins,
      async (plugin) => await plugin.onMessage?.(messageData, { updateUser })
    );
  });
});

client.on('messageDelete', async (message) => {
  if (message.partial) {
    log(`Message ${message.id} was deleted but was a partial`);
    return;
  }
  if (message.author.bot || message.channel.isDMBased()) {
    // Skip bot messages
    return;
  }

  return withUser(message, async (user, updateUser) => {
    const messageData = getMessageData(message, user);
    if (!messageData) {
      return;
    }

    await forEachPlugin(
      plugins,
      async (plugin) =>
        await plugin.onMessageDelete?.(messageData, { updateUser })
    );
  });
});

client.login(DISCORD_BOT_TOKEN);
