import axios from "axios";
import * as cheerio from "cheerio";
import type { WebScraper } from "../../domain/ports/web-scraper";

export class AxiosWebScraper implements WebScraper {
    async getPageContent(url: string): Promise<string> {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        return $("html").text();
    }
}
