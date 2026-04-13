"use client";

import { useState } from "react";

interface WebPConversionProps {
    compressedFile: File | null;
    resizedData: any;
    originalSize: number | null;
}

function formatBytes(bytes: number, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

export default function WebpConversion({ compressedFile, resizedData, originalSize }: WebPConversionProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleConvert = async () => {
        if (!compressedFile) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', compressedFile as File);

        try {
            const response = await fetch('api/webp', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('WebP conversion error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Step 3: WebP Conversion</h2>
            <p className="text-gray-600 mb-6">Convert ke format WebP untuk performa optimal</p>

            <button
                onClick={handleConvert}
                disabled={!compressedFile || loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-medium"
            >
                {loading ? 'Converting...' : 'Convert to WebP'}
            </button>

            {result && (
                <>
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                        {/* Original */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-3">
                                Original Format ({compressedFile?.name})
                            </h3>
                            <img
                                src={result.originalUrl}
                                alt="Original"
                                className="w-full h-64 object-contain rounded bg-gray-50"
                            />
                            <p className="mt-3 text-sm text-gray-600">
                                Size: {formatBytes(result.sizes.original)}
                            </p>
                        </div>

                        {/* WebP Result */}
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-3">WebP Format</h3>
                            <img
                                src={result.webpUrl}
                                alt="WebP"
                                className="w-full h-64 object-contain rounded bg-gray-50"
                            />
                            <p className="mt-3 text-sm text-gray-600">
                                Size: {formatBytes(result.sizes.webp)}
                            </p>
                            <p className="mt-1 text-sm text-green-600 font-medium">
                                Saved: {result.savedPercent}
                            </p>
                        </div>
                    </div>

                    {/* Final Comparison */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Final Comparison (End-to-End)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Original Upload</p>
                                <p className="font-bold">{formatBytes(originalSize ?? 0)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Compressed (Base)</p>
                                <p className="font-bold">{formatBytes(result.sizes.original)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Thumbnail (Step 2)</p>
                                <p className="font-bold">{formatBytes(resizedData?.sizes?.thumbnail)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">WebP (Final)</p>
                                <p className="font-bold text-green-600">{formatBytes(result.sizes.webp)}</p>
                            </div>
                        </div>

                        {originalSize && result.sizes.webp && (
                            <p className="mt-4 text-green-600 font-semibold">
                                Total Savings (WebP vs Original):{" "}
                                {formatBytes(originalSize - result.sizes.webp)} (
                                {(((originalSize - result.sizes.webp) / originalSize) * 100).toFixed(1)}%)
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}