export interface WebScraper {
    getPageContent(url: string, selector: string): Promise<string>;
}
