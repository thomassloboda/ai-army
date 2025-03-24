import axios from "axios";
import { nanoid } from "nanoid";
import type  { ShortUrlService } from "../../domain/ports/short-url-service";

export class GithubShortUrlService implements ShortUrlService {
    async createShortenedURL(url: string): Promise<{ url: string; redirect: string }> {
        const id = nanoid(8);
        await axios.post(
            "https://api.github.com/repos/thomassloboda/url-shortener/dispatches",
            {
                event_type: "generate_redirect",
                client_payload: {
                    key: process.env.REDIRECT_SECRET,
                    value: url,
                    id,
                },
            },
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    Authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            }
        );
        return {
            url,
            redirect: `https://thomas.sloboda.fr/url-shortener/${id}`,
        };
    }
}
