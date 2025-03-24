import {ProcessWebPageUseCase} from "../application/use-cases/process-web-page.use-case";
import {OpenAIChatService} from "../infrastructure/adapters/openai-chat-service";
import {AxiosWebScraper} from "../infrastructure/adapters/axios-web-scraper";
import {GithubShortUrlService} from "../infrastructure/adapters/github-short-url-service";
import {DiscordNotificationService} from "../infrastructure/adapters/discord-notification-service";
import * as dotenv from "dotenv";

dotenv.config();

const args = process.argv.slice(2);
let url: string | undefined;
for (let i = 0; i < args.length; i++) {
    if (args[i] === "--url" && args[i + 1]) {
        url = args[i + 1];
        break;
    }
}

if (!url) {
    console.error("Veuillez fournir une URL avec l'option --url");
    process.exit(1);
}

const chatService = new OpenAIChatService();
const webScraper = new AxiosWebScraper();
const shortUrlService = new GithubShortUrlService();
const notificationService = new DiscordNotificationService();

const useCase = new ProcessWebPageUseCase(chatService, webScraper, shortUrlService, notificationService);

useCase.execute(url)
    .then(page => {
        console.log("Processus terminé");
        process.exit(0);
    })
    .catch(error => {
        console.error("Erreur lors du traitement :", error);
        process.exit(1);
    });
