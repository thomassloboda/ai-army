import type { RssTimeRepository } from "../../domain/ports/rss-time-repository";
import { promises as fs } from "fs";
import * as path from "path";

export class FileRssTimeRepository implements RssTimeRepository {
    private filePath: string;

    constructor() {
        this.filePath = path.join(process.cwd(), "rss_time");
    }

    public async getLastTimestamp(): Promise<Date> {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");
            return new Date(data.trim());
        } catch (error) {
            return new Date(0);
        }
    }

    public async updateTimestamp(newTimestamp: Date): Promise<void> {
        await fs.writeFile(this.filePath, newTimestamp.toISOString(), "utf-8");
    }
}
