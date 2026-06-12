import { useState } from "react";
import { useListProjects } from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  Compass, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = ["All", "Commercial", "Residential", "Cultural", "Institutional", "General"];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: projectsData, isLoading } = useListProjects({
    category: activeCategory === "All" ? undefined : activeCategory,
    page,
    limit
  });

  const totalPages = projectsData ? Math.ceil(projectsData.total / limit) : 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl space-y-6">
            <FadeIn direction="up">
              <Badge className="bg-secondary text-primary hover:bg-secondary/90 py-1 px-4 text-xs font-bold uppercase tracking-widest border-0 mb-4">
                Our Portfolio
              </Badge>
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                Architectural Landmarks <br />
                <span className="text-secondary">Designed for Excellence</span>
              </h1>
              <p className="text-lg text-white/60 max-w-xl">
                Explore our diverse portfolio of residential, commercial, and public structures that redefine the modern landscape.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[72px] z-40 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-primary font-bold mr-4 text-sm uppercase tracking-widest">
            <Filter size={16} /> Filter:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setPage(1);
              }}
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

      {/* Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <motion.div 
                key={activeCategory + page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {projectsData?.data?.map((project, index) => (
                  <FadeIn key={project.id} delay={index * 0.05}>
                    <Link href={`/portfolio/${project.id}`}>
                      <Card className="group overflow-hidden border-0 shadow-lg cursor-pointer h-full bg-white transition-all hover:shadow-2xl flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={project.coverImage || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800"} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-8 text-center">
                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-4">
                              <Badge className="bg-secondary text-primary hover:bg-secondary">{project.category}</Badge>
                              <h3 className="text-white text-2xl font-serif font-bold">{project.title}</h3>
                              <Button className="bg-white text-primary hover:bg-secondary hover:text-white font-bold">
                                View Details <ArrowRight className="ml-2 w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-8 flex-grow flex flex-col justify-between">
                          <div className="space-y-2">
                            <h3 className="text-xl font-serif font-bold text-primary group-hover:text-secondary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                              <Compass size={12} className="text-secondary" /> {project.location || "Various Locations"}
                            </span>
                            <Badge variant="secondary" className="bg-gray-100 text-primary text-[10px]">{project.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </FadeIn>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!isLoading && projectsData?.data.length === 0 && (
            <div className="text-center py-24 space-y-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Compass className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary">No Projects Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any projects in the {activeCategory} category. Try switching filters.
              </p>
              <Button 
                onClick={() => setActiveCategory("All")}
                className="bg-primary text-white"
              >
                Show All Projects
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "w-10 h-10 p-0",
                      page === i + 1 ? "bg-primary text-white" : "border-border text-primary"
                    )}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}