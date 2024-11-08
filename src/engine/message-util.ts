import {
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  OmitPartialGroupDMChannel,
  ThreadChannel,
} from 'discord.js';
import { User } from '../db/user';
import log from '../lib/log';

export type MessageData = {
  message: OmitPartialGroupDMChannel<Message<boolean>>;
  user: User;
  guild: Guild;
  channel: GuildChannel | ThreadChannel;
  member: GuildMember;
  command: string | null;
};

export type MessageActions = {
  updateUser: (user: User) => void;
};

export function getMessageData(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
  user: User
): MessageData | null {
  const guild = message.guild;
  if (!guild) {
    log('ERROR: No guild on message');
    return null;
  }

  const member = guild.members.resolve(message.author.id);
  if (!member) {
    log('ERROR: No member in guild');
    return null;
  }

  const channel = guild.channels.resolve(message.channel.id);
  if (!channel) {
    log('ERROR: No channel in guild');
    return null;
  }

  return {
    message,
    user,
    guild,
    channel,
    member,
    command: isCommand(message),
  };
}

const PREFIX = '!';
const matcher = new RegExp(`^${PREFIX}([a-zA-Z-]+)( |$)`);

function isCommand(message: OmitPartialGroupDMChannel<Message<boolean>>): string | null {
  const match = message.content.match(matcher);
  if (match) {
    return match[1].toLowerCase();
  }
  return null;
}
