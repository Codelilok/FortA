import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./FadeIn";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(26, 39, 68, 0.8), rgba(26, 39, 68, 0.4)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <FadeIn direction="up">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Building Visions, <br />
            <span className="text-secondary">Crafting Excellence</span>
          </h1>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Professional architecture and construction services tailored to your unique needs. We transform concepts into iconic structures.
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/portfolio">
              <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold min-w-[180px] h-14 text-lg">
                View Portfolio
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold min-w-[180px] h-14 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1 h-2 bg-secondary rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}