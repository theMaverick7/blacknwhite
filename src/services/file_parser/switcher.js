import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx/xlsx.mjs';
import tesseract from 'node-tesseract-ocr';
import { enhanceImage } from './enhance.js';
import { readFile } from 'node:fs/promises';
import { extractPdfImages } from './extractFromPdf.js';

async function switcher(filetype, path) {
    try {
        switch (filetype.mime) {
            case 'application/pdf':
                console.log(`Processing PDF file: ${path}`);
                const buffer = await readFile(path);
                const parser = new PDFParse({ data: buffer });
                let text = (await parser.getText()).text;

                if (text.length <= 20) {
                    console.log(`PDF file is empty or unreadable: ${path}`);
                    await extractPdfImages(path);
                    const buffer = await readFile(`media/uploads/image-1.png`);
                    const enhancedImageBuffer = await enhanceImage(buffer);
                    text = await tesseract.recognize(enhancedImageBuffer, {
                        lang: "eng",
                        oem: 1,
                        psm: 3,
                    });
                }

                await parser.destroy();
                return text;

            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                console.log(`Processing DOCX file: ${path}`);
                return (await mammoth.extractRawText({ path: path })).value;

            case 'image/jpeg':
            case 'image/png':
                const enhancedImageBuffer = await enhanceImage(path);
                console.log(`Processing image file: ${path}`);
                return await tesseract.recognize(enhancedImageBuffer, {
                    lang: "eng",
                    oem: 1,
                    psm: 3,
                });

            default:
                throw new Error(`Unsupported file type: ${filetype.mime}`);
        }

    } catch (err) {
        console.error(`Error processing file ${path}:`, err);
    }
}

export default switcher;