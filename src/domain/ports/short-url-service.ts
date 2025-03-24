export interface ShortUrlService {
    createShortenedURL(url: string): Promise<{ url: string; redirect: string }>;
}
