import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

export function createSlug(title: string): string {
    return title
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading and trailing whitespace
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Remove consecutive hyphens
}



cloudinary.config({
    cloud_name: `${process.env.CLOUD_NAME}`,
    api_key: `${process.env.CLOUD_APIKEY}`,
    api_secret: `${process.env.CLOUD_SECRET}`// Click 'View API Keys' above to copy your API secret
});

export { cloudinary };

// Add this helper function to utils.ts
export async function fetchImageBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}


const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});


export async function handleImageUpload(file: Express.Multer.File | undefined, imageUrl?: string): Promise<string | null> {
    if (!file && !imageUrl) return null;

    try {
        const imageBuffer = file ? file.buffer : await fetchImageBuffer(imageUrl!);
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'blog-banners'
                },
                (error, result) => error ? reject(error) : resolve(result)
            );
            uploadStream.end(imageBuffer);
        });
        return (result as any).secure_url;
    } catch (error) {
        console.error('Image upload error:', error);
        throw new Error('Failed to upload image');
    }
}