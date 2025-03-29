import type {ChatService} from "../../domain/ports/chat-service";
import OpenAI from "openai";
import type {
    ChatCompletionContentPart,
    ChatCompletionContentPartText,
    ChatCompletionContentPartRefusal
} from "openai/resources/chat/completions/completions";
import * as fs from "node:fs";

type Content =
    string
    | ChatCompletionContentPartText[]
    | ChatCompletionContentPart[]
    | (ChatCompletionContentPartText | ChatCompletionContentPartRefusal)[]
    | null
    | undefined;


export class OpenAIChatService implements ChatService {
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI();
    }

    async attachContent(filePath: string): Promise<string> {
        const fileId = await this.client.files.create({
            file: fs.createReadStream(filePath),
            purpose: 'user_data'
        });

        return fileId.id;
    }

    async detachContent(contentReference: string): Promise<void> {
        await this.client.files.del(contentReference);
    }

    async sendMessage(message: string, attachedContentReference ?: string): Promise<string> {
        let content: Content = message;
        if (attachedContentReference) {
            content = [{
                type: "file",
                file: {
                    file_id: attachedContentReference,
                }
            }, {
                type: "text",
                text: message
            }]
        }
        const completion = await this.client.chat.completions.create({
            model: "gpt-4o",
            messages: [{role: "user", content}],
        });
        return completion.choices[0].message.content ?? "";
    }
}
