import type { RssFeedReader } from "../../domain/ports/rss-feed-reader";
import type { RssTimeRepository } from "../../domain/ports/rss-time-repository";
import type { Article } from "../../domain/entities/article";

export class ProcessRssFeedUseCase {
    constructor(
        private rssFeedReader: RssFeedReader,
        private rssTimeRepository: RssTimeRepository
    ) {}

    public async execute(feedUrl: string): Promise<Article[]> {
        const lastTimestamp = await this.rssTimeRepository.getLastTimestamp();

        const articles = await this.rssFeedReader.readFeed(feedUrl);

        const newArticles = articles.filter(article => article.pubDate > lastTimestamp);

        if (newArticles.length > 0) {
            const maxDate = newArticles.reduce((prev, current) =>
                    current.pubDate > prev ? current.pubDate : prev,
                newArticles[0].pubDate
            );
            await this.rssTimeRepository.updateTimestamp(maxDate);
        }

        return newArticles;
    }
}
