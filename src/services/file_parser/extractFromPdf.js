import { readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { extractImages, getDocumentProxy } from 'unpdf';
import logger from './logger.js';

export async function extractPdfImages(filePath) {
    try {
        const buffer = await readFile(filePath)
        const pdf = await getDocumentProxy(new Uint8Array(buffer))

        // Extract images from page 1
        const imagesData = await extractImages(pdf, 1)
        logger.info(`Found ${imagesData.length} images on page 1`)

        // Process each image with sharp (optional)
        let totalImagesProcessed = 0
        for (const imgData of imagesData) {
            const imageIndex = ++totalImagesProcessed

            await sharp(imgData.data, {
                raw: {
                    width: imgData.width,
                    height: imgData.height,
                    channels: imgData.channels
                }
            })
                .png()
                .toFile(`media/uploads/image-${imageIndex}.png`)

            logger.info(`Saved image ${imageIndex} (${imgData.width}x${imgData.height}, ${imgData.channels} channels)`)
        }
    } catch (error) {
        logger.error(`Error extracting images from PDF: ${error.message}`);
    }
}