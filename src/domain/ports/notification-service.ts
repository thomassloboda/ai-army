export interface NotificationService {
    notify(message: string): Promise<void>;
}
