import log from '../lib/log';
import { Plugin } from './plugin';

type Reward = {
  requirement: number;
  roleId: string;
};

export default function ({ rewards }: { rewards: Reward[] }): Plugin {
  return {
    name: 'role-earner',

    async onMessage({ message, user }, { updateUser }) {
      const member = message.guild?.members.resolve(message.author);
      if (!member) {
        log(`ERROR: Unable to load member information for ${user.name}`);
        return;
      }

      const toApply = rewards.filter(({ roleId, requirement }) => {
        return (
          user.points >= requirement && !user.rolesAwarded.includes(roleId)
        );
      });

      if (toApply.length === 0) {
        return;
      }

      for (const reward of toApply) {
        const role = message.guild?.roles.resolve(reward.roleId);
        log(`${user.name} has been rewarded ${role?.name || reward.roleId}`);
        await member.roles.add(reward.roleId);
      }

      updateUser({
        ...user,
        rolesAwarded: [
          ...user.rolesAwarded,
          ...toApply.map((reward) => reward.roleId),
        ],
      });
    },
  };
}
