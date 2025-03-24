import {Client, GatewayIntentBits, TextChannel, ThreadChannel} from "discord.js";
import type {NotificationService} from "../../domain/ports/notification-service";

export class DiscordNotificationService implements NotificationService {
    private readonly TOKEN: string | undefined = process.env.DISCORD_TOKEN;
    private readonly CHANNEL_ID: string | undefined = process.env.DISCORD_CHANNEL_ID;

    notify(message: string): Promise<void> {
        console.log('notify with', {token: this.TOKEN, channelId: this.CHANNEL_ID});
        if (!this.TOKEN || !this.CHANNEL_ID) {
            return Promise.reject('Missing Discord token or channel ID.');
        }
        return new Promise(async (resolve, reject) => {
            const client = new Client({
                intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
            });

            client.once("ready", async () => {
                const channel = await client.channels.fetch(this.CHANNEL_ID as string) as TextChannel;
                if (!channel || !channel.isTextBased()) {
                    console.error("Le salon spécifié n'est pas valide.");
                    return;
                }

                const today = new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                });
                let thread: ThreadChannel | undefined = channel.threads.cache.find(t => t.name === today);

                if (!thread) {
                    const threadMessage = await channel.send(`📅 **${today}**`);
                    thread = await threadMessage.startThread({
                        name: today,
                        autoArchiveDuration: 60,
                    });
                }
                console.log('thread', thread);
                await thread.send(message);
                return resolve();
            });

            await client.login(this.TOKEN);
        })
    }
}
