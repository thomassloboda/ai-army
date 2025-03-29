import * as cheerio from "cheerio";
import type { WebScraper } from "../../domain/ports/web-scraper";
import {axiosInstance} from "../utils/axios-instance";

export class AxiosWebScraper implements WebScraper {
    async getPageContent(url: string, selector:string): Promise<string> {
        const response = await axiosInstance.get(url);
        const $ = cheerio.load(response.data);
        return $(selector).text();
    }
}
