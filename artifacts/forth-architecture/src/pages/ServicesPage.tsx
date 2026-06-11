import { useListServices } from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  Sofa,
  HardHat,
  Map,
  BarChart3,
  Leaf,
  Lightbulb, 
  Compass, 
  Hammer, 
  Layout, 
  PenTool,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesPage() {
  const { data: services, isLoading } = useListServices();

  const serviceIcons: Record<string, any> = {
    Building2,
    Sofa,
    HardHat,
    Map,
    BarChart3,
    Leaf,
    architecture: Building2,
    interior: Lightbulb,
    design: Compass,
    construction: Hammer,
    planning: Layout,
    consulting: PenTool,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(26, 39, 68, 0.9), rgba(26, 39, 68, 0.7)), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn direction="up">
            <Badge variant="outline" className="text-secondary border-secondary mb-4 py-1 px-4 text-xs font-bold uppercase tracking-widest">
              What We Offer
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">Our Expert Services</h1>
          </FadeIn>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
              ))
            ) : (
              services?.map((service, index) => {
                const Icon = serviceIcons[service.icon] || serviceIcons[service.icon.toLowerCase()] || Building2;
                return (
                  <FadeIn key={service.id} delay={index * 0.05}>
                    <motion.div 
                      whileHover={{ y: -10 }}
                      className="group p-12 bg-white border border-border rounded-2xl h-full flex flex-col items-start transition-all duration-300 hover:border-secondary hover:shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-secondary/20 transition-all duration-500" />
                      
                      <div className="mb-8 p-5 bg-gray-50 rounded-2xl group-hover:bg-secondary/10 transition-colors relative z-10">
                        <Icon className="w-12 h-12 text-primary group-hover:text-secondary transition-colors" />
                      </div>
                      
                      <h3 className="text-2xl font-serif font-bold text-primary mb-6 relative z-10">
                        {service.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-8 flex-grow relative z-10">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-primary font-bold group-hover:text-secondary transition-colors relative z-10">
                        Discuss this service <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  </FadeIn>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-primary text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <FadeIn>
              <Badge variant="outline" className="text-secondary border-secondary mb-4 py-1 px-4 text-xs font-bold uppercase tracking-widest">
                Our Process
              </Badge>
              <h2 className="text-3xl md:text-5xl font-serif font-bold">How We Bring Your Vision To Life</h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="absolute top-24 left-0 w-full h-0.5 bg-white/10 hidden lg:block z-0" />
            
            {[
              { step: "01", title: "Consultation", desc: "Understanding your goals and requirements in detail." },
              { step: "02", title: "Design", desc: "Crafting a bespoke architectural plan that exceeds expectations." },
              { step: "03", title: "Construction", desc: "Executing with precision and the highest quality materials." },
              { step: "04", title: "Delivery", desc: "Handing over your completed masterpiece, ready to inspire." },
            ].map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.1} className="relative z-10 text-center space-y-6">
                <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center text-xl font-bold mx-auto border-4 border-primary">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-secondary">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}