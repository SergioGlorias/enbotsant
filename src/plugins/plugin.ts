import { MessageData, MessageActions } from '../engine/message-util';
import {OmitPartialGroupDMChannel, Message} from "discord.js"

export type Plugin = {
  name: string;
  onMessage?(data: MessageData, actions: MessageActions): Promise<void>;

  onMessageDelete?(data: MessageData, actions: MessageActions): Promise<void>;
};
