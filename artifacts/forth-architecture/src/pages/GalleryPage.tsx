import { useState, useMemo } from "react";
import { useListGallery } from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<{url: string, title: string} | null>(null);

  const { data: allGallery, isLoading } = useListGallery({});

  const categories = useMemo(() => {
    if (!allGallery) return ["All"];
    const unique = Array.from(new Set(allGallery.map((item) => item.category).filter(Boolean)));
    return ["All", ...unique.sort()];
  }, [allGallery]);

  const gallery = useMemo(() => {
    if (!allGallery) return [];
    if (activeCategory === "All") return allGallery;
    return allGallery.filter((item) => item.category === activeCategory);
  }, [allGallery, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn direction="up" className="max-w-2xl mx-auto space-y-6">
            <Badge className="bg-secondary text-primary hover:bg-secondary/90 py-1 px-4 text-xs font-bold uppercase tracking-widest border-0">
              Visual Journey
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold">Project Gallery</h1>
            <p className="text-lg text-white/60">
              A curated collection of our finest work, captured through the lens of architectural excellence.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[72px] z-40 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-primary font-bold mr-4 text-sm uppercase tracking-widest">
            <Filter size={16} /> Filter:
          </div>
          {isLoading
            ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)
            : categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold transition-all border",
                    activeCategory === cat
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-transparent text-primary border-border hover:border-secondary hover:text-secondary"
                  )}
                >
                  {cat}
                </button>
              ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="w-full h-[400px] rounded-2xl" />
                ))}
              </div>
            ) : (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
              >
                {gallery.map((item, index) => (
                  <FadeIn key={item.id} delay={index * 0.05} className="break-inside-avoid">
                    <div
                      className="group relative overflow-hidden rounded-2xl bg-gray-100 cursor-zoom-in"
                      onClick={() => setSelectedImage({ url: item.imageUrl, title: item.title })}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center">
                        <ZoomIn className="text-secondary w-12 h-12 mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                        <h3 className="text-white text-xl font-serif font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                          {item.title}
                        </h3>
                        <Badge className="mt-4 bg-secondary text-primary">{item.category}</Badge>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && gallery.length === 0 && (
            <div className="text-center py-24 space-y-4">
              <p className="text-2xl font-serif font-bold text-primary">No images in this category</p>
              <button
                onClick={() => setActiveCategory("All")}
                className="text-secondary font-bold underline underline-offset-4"
              >
                Show all photos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 flex flex-col items-center justify-center p-4 md:p-12"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-white hover:text-secondary transition-colors p-2 rounded-full bg-white/10"
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full max-h-[80vh] flex flex-col items-center"
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain mb-6"
              />
              <div className="text-center text-white">
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
