import type { ChatService } from "../../domain/ports/chat-service";
import OpenAI from "openai";

export class OpenAIChatService implements ChatService {
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI();
    }

    async sendMessage(message: string): Promise<string> {
        const completion = await this.client.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: message }],
        });
        return completion.choices[0].message.content ?? "";
    }
}
