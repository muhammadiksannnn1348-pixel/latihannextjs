import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, mkdir, stat } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const timestamp = Date.now();
        const ext = file.name.split('.').pop();

        // Simpan file original
        const originalFilename = `${timestamp}-original.${ext}`;
        const originalPath = path.join(uploadDir, originalFilename);
        await writeFile(originalPath, buffer);

        // Convert ke WebP
        const webpFilename = `${timestamp}-converted.webp`;
        const webpPath = path.join(uploadDir, webpFilename);
        await sharp(buffer)
            .webp({ quality: 80 })
            .toFile(webpPath);

        const originalStats = await stat(originalPath);
        const webpStats = await stat(webpPath);

        const savedPercent = (((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1);

        return NextResponse.json({
            originalUrl: '/uploads/' + originalFilename,
            webpUrl: '/uploads/' + webpFilename,
            sizes: {
                original: originalStats.size,
                webp: webpStats.size,
            },
            savedPercent: savedPercent + '%',
        });

    } catch (error) {
        console.error('WebP conversion error:', error);
        return NextResponse.json({ error: "Failed to convert image" }, { status: 500 });
    }
}