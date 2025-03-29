export interface FileService {
    writeFile(path: string, content: string): Promise<void>;

    deleteFile(path: string): Promise<void>;
}
