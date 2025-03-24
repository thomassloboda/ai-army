export interface WebScraper {
    getPageContent(url: string): Promise<string>;
}
