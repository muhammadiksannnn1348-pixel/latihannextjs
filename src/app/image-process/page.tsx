"use client";

import { useState } from "react";
import ClientCompression from "@/component/ClientCompression";
import ServerResize from "@/component/ServerSide";
import WebpConversion from "@/component/WebPConversion";

export default function ImageProcessPage() {
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [originalSize, setOriginalSize] = useState<number | null>(null);
    const [resizedData, setResizedData] = useState<any | null>(null);

    const handleCompressed = (file: File, originalSize: number) => {
        setCompressedFile(file);
        setOriginalSize(originalSize);
    };

    const handleResized = (data: any) => {
        console.log("File setelah resize:", data);
        setResizedData(data);
    };

    return (
        <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h4 className="text-4xl font-bold text-center mb-8">
                    Image Optimizer
                </h4>

                {/* Step 1 */}
                <ClientCompression onCompressed={handleCompressed} />

                {/* Step 2 */}
                {compressedFile && (
                    <ServerResize
                        compressedFile={compressedFile}
                        originalSize={originalSize}
                        onresized={handleResized}
                    />
                )}

                {/* Step 3 */}
                {compressedFile && (
                    <div className="mt-8">
                        <WebpConversion
                            compressedFile={compressedFile}
                            resizedData={resizedData}
                            originalSize={originalSize}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}