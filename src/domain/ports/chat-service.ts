export interface ChatService {
    sendMessage(message: string): Promise<string>;
}
