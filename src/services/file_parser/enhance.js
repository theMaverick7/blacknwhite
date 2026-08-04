import sharp from "sharp";
import logger from "./logger.js";

export async function enhanceImage(imagePath) {
    try {
        return await sharp(imagePath)
            .resize({ width: 800 }) // Resize to a width of 800px, maintaining aspect ratio
            .sharpen({
                sigma: 2,
                m1: 0,
                m2: 3,
                x1: 3,
                y2: 15,
                y3: 15,
            }).toBuffer();

    } catch (error) {
        logger.error(`Error enhancing image ${imagePath}:`, error.message);
    }
}