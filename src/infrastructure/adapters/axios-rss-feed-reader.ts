import type {RssFeedReader} from "../../domain/ports/rss-feed-reader";
import type {Article} from "../../domain/entities/article";
import * as cheerio from "cheerio";
import {axiosInstance} from "../utils/axios-instance";

export class AxiosRssFeedReader implements RssFeedReader {
    public async readFeed(url: string): Promise<Article[]> {
        const response = await axiosInstance.get(url);
        const xml = response.data;
        const $ = cheerio.load(xml, {xmlMode: true});
        const articles: Article[] = [];

        $("item").each((_, elem) => {
            const title = $(elem).find("title").text();
            const link = $(elem).find("link").text();
            const pubDateStr = $(elem).find("pubDate").text();
            const description = $(elem).find("description").text();
            const pubDate = new Date(pubDateStr);

            articles.push({title, link, pubDate, description});
        });

        return articles;
    }
}
