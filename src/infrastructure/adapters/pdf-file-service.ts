import {FileService} from "../../domain/ports/file-service";
import {createWriteStream, rm} from "node:fs";
import PDFDocument from 'pdfkit';

export class PdfFileService implements FileService {
    async writeFile(path: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const stream = createWriteStream(path);

            doc.pipe(stream);
            doc.text(content);
            doc.end();

            stream.on("finish", () => resolve());
            stream.on("error", (error) => reject(error));
        });
    }

    async deleteFile(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            rm(
                path,
                { force: true },
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

}
