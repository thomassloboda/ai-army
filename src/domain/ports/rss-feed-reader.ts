import type { Article } from "../entities/article";

export interface RssFeedReader {
    readFeed(url: string): Promise<Article[]>;
}
