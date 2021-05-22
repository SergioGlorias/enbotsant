import { Plugin } from './plugin';

export default function (): Plugin {
  return {
    name: 'name-updater',

    onMessage({ message, user, updateUser }) {
      if (message.author.username !== user.name) {
        console.log(
          new Date().toISOString(),
          `${user.name || user._id} is now known as ${message.author.username}`
        );
        updateUser({
          ...user,
          name: message.author.username,
        });
      }
      return Promise.resolve();
    },
  };
}
