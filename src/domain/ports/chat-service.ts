export interface ChatService {
    attachContent(filePath: string): Promise<string>;

    detachContent(contentReference: string): Promise<void>;

    sendMessage(message: string, attachedContentReference?: string): Promise<string>;
}
