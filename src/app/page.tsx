import { Header } from "@/components/layout/Header";
import { EditorialMasthead } from "@/components/layout/EditorialMasthead";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary">
      {/* Kontainer Konten Utama (z-10 bg-canvas agar menutupi Sticky Footer di belakangnya) */}
      <div className="relative z-10 bg-canvas min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <EditorialMasthead />

          {/* Area Penampung Feed Kurasi (Tahap 3) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="border border-dashed border-border rounded-card p-12 text-center bg-surface/30">
              <h2 className="font-serif text-2xl text-text-primary mb-2">
                Katalog Kurasi Siap Dirangkai
              </h2>
              <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
                Tahap 1 (instalasi dependensi) dan Tahap 2 (Header, Masthead, Sticky Footer, dan Halaman About) telah aktif.
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Sticky Curtain Reveal Footer */}
      <Footer />
    </div>
  );
}
