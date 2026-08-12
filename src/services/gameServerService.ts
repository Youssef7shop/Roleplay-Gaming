import { WhitelistApplication } from '../types';

/**
 * Game Server Integration Service Abstraction
 * 
 * This service provides the hooks for synchronizing accepted whitelist applications
 * directly with your game server framework (e.g. FiveM, RageMP, alt:V, OpenMP).
 * 
 * When an admin accepts or revokes a player's whitelist status, these functions are called.
 */

export interface GameServerSyncResult {
  success: boolean;
  message: string;
}

/**
 * Triggered when an application status is marked as 'accepted'.
 * Connect your FiveM / RageMP / alt:V Webhook or REST API endpoint here.
 * 
 * Example integration points:
 * - Insert steamIdentifier / discordId into game server database (`users` / `whitelist` table)
 * - POST to `http://your-gameserver-ip:30120/whitelist/add`
 * - Send a Discord Bot notification via webhook
 */
export const approveWhitelistOnGameServer = async (
  application: WhitelistApplication
): Promise<GameServerSyncResult> => {
  console.log(`[GameServerService] Approving whitelist for character: ${application.characterName} (Discord: ${application.discordUsername})`);

  // Developer Note: Place real game server API / Webhook calls here
  // e.g.:
  // const res = await fetch(process.env.GAMESERVER_API_URL + '/whitelist', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${process.env.GAMESERVER_SECRET}` },
  //   body: JSON.stringify({ discord: application.discordUsername, name: application.characterName })
  // });

  return {
    success: true,
    message: `Player ${application.characterName} (${application.discordUsername}) prepared for game server sync.`
  };
};

/**
 * Triggered when a whitelist is revoked or rejected.
 */
export const revokeWhitelistOnGameServer = async (
  application: WhitelistApplication
): Promise<GameServerSyncResult> => {
  console.log(`[GameServerService] Revoking whitelist for character: ${application.characterName}`);

  return {
    success: true,
    message: `Whitelist revoked for ${application.characterName}.`
  };
};
