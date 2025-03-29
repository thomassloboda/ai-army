import type {ChatService} from "../../domain/ports/chat-service";
import type {WebScraper} from "../../domain/ports/web-scraper";
import type {ShortUrlService} from "../../domain/ports/short-url-service";
import type {NotificationService} from "../../domain/ports/notification-service";
import type {PageContent} from "../../domain/entities/page-content";
import {FileService} from "../../domain/ports/file-service";

export class ProcessWebPageUseCase {
    constructor(
        private chatService: ChatService,
        private webScraper: WebScraper,
        private shortUrlService: ShortUrlService,
        private notificationService: NotificationService,
        private fileService: FileService
    ) {
    }

    public async execute(url: string, selector = 'body', tmpFilePath= `./tmp_${Date.now()}.txt`): Promise<PageContent> {
        const {url: originalUrl, redirect} = await this.shortUrlService.createShortenedURL(url);

        const rawContent = await this.webScraper.getPageContent(originalUrl, selector);

        let page: PageContent = {url: originalUrl, redirect, rawContent};

        await this.fileService.writeFile(tmpFilePath, rawContent);

        const prompt = `
            Analyse cette page HTML et résume ce contenu en français de manière claire et informative (max 2000 caractères), en respectant ce format adapté à Discord :  
               - Un titre principal en majuscules  
               - Des sous-titres délimités par des tirets (—) si nécessaire  
               - Des listes à puces avec des tirets (-)  
               - Un lien vers ${redirect} avec le texte : "[Lien](${redirect})"  
               - Priorise l'essentiel et limite à 2 phrases par section.  
           Attention: ne pas dépasser les 2000 caractères en sortie, balisage inclut !
        `;

        page.contentReference = await this.chatService.attachContent(tmpFilePath);
        page.translatedContent = await this.chatService.sendMessage(prompt, page.contentReference);

        await this.chatService.detachContent(page.contentReference);
        await this.fileService.deleteFile(tmpFilePath);

        await this.notificationService.notify(page.translatedContent);

        return page;
    }
}
