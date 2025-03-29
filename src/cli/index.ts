import {ProcessWebPageUseCase} from "../application/use-cases/process-web-page.use-case";
import {OpenAIChatService} from "../infrastructure/adapters/openai-chat-service";
import {AxiosWebScraper} from "../infrastructure/adapters/axios-web-scraper";
import {GithubShortUrlService} from "../infrastructure/adapters/github-short-url-service";
import {DiscordNotificationService} from "../infrastructure/adapters/discord-notification-service";
import * as dotenv from "dotenv";
import {ProcessRssFeedUseCase} from "../application/use-cases/process-rss-feed.use-case";
import {AxiosRssFeedReader} from "../infrastructure/adapters/axios-rss-feed-reader";
import {FileRssTimeRepository} from "../infrastructure/adapters/file-rss-time-repository";
import {ChatService} from "../domain/ports/chat-service";
import {NotificationService} from "../domain/ports/notification-service";
import {PdfFileService} from "../infrastructure/adapters/pdf-file-service";

dotenv.config();

const args = process.argv.slice(2);
let url: string | undefined;
let rss: string | undefined;
let selector: string | undefined;
for (let i = 0; i < args.length; i++) {
    if (args[i] === "--url" && args[i + 1]) {
        url = args[i + 1];
        break;
    }
    if (args[i] === "--rss" && args[i + 1] && args[i + 2] === "--selector" && args[i + 3]) {
        rss = args[i + 1];
        selector = args[i + 3];
        break;
    }
    if (args[i] === "--help") {
        console.log('Usage:');
        console.log('node dist/cli/index.js --url <url>');
        console.log('node dist/cli/index.js --rss <url> --selector <selector>');
        process.exit(0);
    }
}

if (!url && (!rss || !selector)) {
    console.error('Veuillez consulter l\'aide --help');
    process.exit(1);
}

const chatService = new OpenAIChatService();
const webScraper = new AxiosWebScraper();
const shortUrlService = new GithubShortUrlService();
const notificationService = new DiscordNotificationService();
const rssFeedReader = new AxiosRssFeedReader();
const rssTimeRepository = new FileRssTimeRepository();
const pdfFileService = new PdfFileService();

const processWebPageUseCase = new ProcessWebPageUseCase(chatService, webScraper, shortUrlService, notificationService, pdfFileService);
const processRssFeedUseCase = new ProcessRssFeedUseCase(rssFeedReader, rssTimeRepository);

if (url) {

    processWebPageUseCase.execute(url)
        .then(page => {
            console.log("Processus terminé");
            process.exit(0);
        })
        .catch(error => {
            console.error("Erreur lors du traitement :", error);
            process.exit(1);
        });
}

if (rss && selector) {

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


    processRssFeedUseCase.execute(rss)
        .then(async (articles) => {
            for (const article of articles) {
                await processWebPageUseCase.execute(article.link, selector, `tmp_${Date.now()}.pdf`);
                await delay(10000);
            }
        })
        .then(page => {
            console.log("Processus terminé");
            process.exit(0);
        }).catch(error => {
        console.error('Erreur lors du traitement :', error);
        process.exit(1);
    });
}
