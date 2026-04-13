import Image from "next/image"

export default function MediaSection() {
    return (
        <section className="mt-8 space-y-8">
            {/* Judul Section */}
            <h3 className="text-2xl font-bold">Galeri Media Section</h3>

            {/* Single Image dengan Next/Image */}
            <div className="space-y-4">
                <h4 className="text-2xl font-semibold">Gambar Optimasi Otomatis</h4>
                <Image 
                    src="/revuelto.png"
                    alt="Gambar Optimasi Otomatis"
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-xl"
                />
                <p className="text-gray-600 text-sm">
                    Gambar ini otomatis di lazy load, dikonversi jadi WebP, dan ukurannya disesuaikan
                </p>
            </div> 

            {/* Grid Gambar 2: di mobile bertumpuk */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Galeri Responsiv</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Image
                        src="/gambar.png"
                        alt="Gambar Pertama"
                        width={800}
                        height={500}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <Image
                        src="/gambar2.png"
                        alt="Gambar Kedua"
                        width={800}
                        height={500}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* Video Responsive Youtube */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Video Responsive Youtube</h4>
                <div className="aspect-video w-full">
                    <iframe src="https://youtube.com/embed/yCNUP2NAt-A?si=YHGJqbMi5exgsfuG" 
                    allowFullScreen
                        className="w-full h-full rounded-lg shadow-xl">
                    </iframe>
                </div>
                <p className="text-gray-600 text-sm">Video Selalu rasio 16:9 dan responsif disemua ukuran layar</p>
            </div>

            {/* Video Lokal */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Video Responsive Youtube</h4>
                <div className="aspect-video w-full">
                    <video 
                    src="test.mp4" 
                    controls
                    className="w-full h-full rounded-lg shadow-xl"></video>
                </div>
                <p className="text-gray-600 text-sm">Video lokal juga bisa responsif dengan cara yang sama</p>
            </div>
        </section>
    )
}