import { Message, OmitPartialGroupDMChannel } from 'discord.js';

import { Plugin } from './plugin';

export default function (): Plugin {
  return {
    name: 'invite-deleter',
    async onMessage({ message }) {
      if (isInvite(message)) {
        await message.reply('Sorry, no invites here, try #promotion');
        await message.delete();
      }
    },
  };
}

function isInvite(message: OmitPartialGroupDMChannel<Message<boolean>>) {
  return (
    message.content.includes('discordapp.com/invite') ||
    message.content.includes('discord.gg/')
  );
}
