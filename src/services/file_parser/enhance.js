import sharp from "sharp";

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
        console.error(`Error enhancing image ${imagePath}:`, error);
    }
}