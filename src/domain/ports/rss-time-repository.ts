export interface RssTimeRepository {
    getLastTimestamp(): Promise<Date>;

    updateTimestamp(newTimestamp: Date): Promise<void>;
}
