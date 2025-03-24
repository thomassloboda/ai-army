import type { ChatService } from "../../domain/ports/chat-service";
import type { WebScraper } from "../../domain/ports/web-scraper";
import type {ShortUrlService} from "../../domain/ports/short-url-service";
import type {NotificationService} from "../../domain/ports/notification-service";
import type {PageContent} from "../../domain/entities/page-content";

export class ProcessWebPageUseCase {
    constructor(
        private chatService: ChatService,
        private webScraper: WebScraper,
        private shortUrlService: ShortUrlService,
        private notificationService: NotificationService
    ) {}

    public async execute(url: string): Promise<PageContent> {
        const { url: originalUrl, redirect } = await this.shortUrlService.createShortenedURL(url);

        const rawContent = await this.webScraper.getPageContent(originalUrl);

        let page: PageContent = { url: originalUrl, redirect, rawContent };

        const extractionPrompt = `
Extrait le contenu intéressant de cette page HTML : ${rawContent}.
Conserve le formatage et restitue le contenu en Markdown.
    `;
        page.extractedContent = await this.chatService.sendMessage(extractionPrompt);

        const translatePrompt = `
Veuillez résumer le contenu de la page web : ${page.extractedContent}.
Le résumé doit être en français, clair et informatif (max 2000 caractères) et formatté pour Discord avec :
- Un titre principal en majuscules
- Des sous-titres délimités par des tirets (—) si nécessaire
- Des listes à puces avec des tirets (-)
- Un lien vers ${redirect} avec le texte : "👉 [Lien](${redirect})"
Priorisez l'essentiel en limitant à 2 phrases par section.
    `;
        page.translatedContent = await this.chatService.sendMessage(translatePrompt);

        // 5. Notification (par exemple Discord)
        await this.notificationService.notify(page.translatedContent);

        return page;
    }
}
