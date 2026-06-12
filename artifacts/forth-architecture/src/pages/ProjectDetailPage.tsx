import { useParams, Link } from "wouter";
import { useGetProject } from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Layers,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const projectId = id ? parseInt(id) : 0;
  const { data: project, isLoading } = useGetProject(projectId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar solid />
        <div className="pt-32 pb-24 container mx-auto px-4 md:px-6">
          <Skeleton className="h-10 w-48 mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-8">
              <Skeleton className="h-16 w-3/4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Navbar solid />
        <h2 className="text-3xl font-serif font-bold text-primary mb-6">Project Not Found</h2>
        <Link href="/portfolio">
          <Button className="bg-primary text-white">Back to Portfolio</Button>
        </Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar solid />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn direction="up">
            <Link href="/portfolio">
              <button className="flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors mb-12 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Portfolio
              </button>
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Project Info */}
            <FadeIn direction="right" className="space-y-10 order-2 lg:order-1">
              <div className="space-y-4">
                <Badge variant="outline" className="text-secondary border-secondary py-1 px-4 text-xs font-bold uppercase tracking-widest">
                  {project.category}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary leading-tight">
                  {project.title}
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-gray-50 rounded-2xl border border-border">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <MapPin size={12} className="text-secondary" /> Location
                  </p>
                  <p className="font-bold text-primary">{project.location || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} className="text-secondary" /> Completed
                  </p>
                  <p className="font-bold text-primary">{project.completionDate || "In Progress"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <Layers size={12} className="text-secondary" /> Category
                  </p>
                  <p className="font-bold text-primary">{project.category}</p>
                </div>
              </div>

              <div className="prose prose-lg text-muted-foreground max-w-none">
                <h3 className="text-xl font-bold text-primary mb-4">Project Overview</h3>
                <p className="leading-relaxed">
                  {project.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {["Structural Integrity", "Energy Efficiency", "Bespoke Interior", "Landscaped Surroundings"].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="text-secondary w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-bold px-8 h-14 rounded-xl">
                    Inquire About This Project
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Project Media */}
            <FadeIn direction="left" className="order-1 lg:order-2 space-y-6">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group cursor-zoom-in" onClick={() => setSelectedImage(project.coverImage)}>
                <img 
                  src={project.coverImage || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=1200"} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Badge className="bg-white text-primary">Click to Expand</Badge>
                </div>
              </div>

              {/* Gallery Grid */}
              {project.images && project.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {project.images.map((img) => (
                    <motion.div 
                      key={img.id}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
                      onClick={() => setSelectedImage(img.imageUrl)}
                    >
                      <img 
                        src={img.imageUrl} 
                        alt="Project detail" 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-8 right-8 text-white hover:text-secondary transition-colors"
            >
              <Layers className="rotate-45" size={40} />
            </motion.button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImage} 
              alt="Project view" 
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}