import { 
  useListProjects, 
  useListServices, 
  useGetDashboardStats,
  useGetCompanyInfo 
} from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { FadeIn } from "@/components/FadeIn";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Building2, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Lightbulb,
  Compass,
  Hammer
} from "lucide-react";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setCount(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{count}</span>;
}

export default function HomePage() {
  const { data: stats } = useGetDashboardStats();
  const { data: featuredProjects } = useListProjects({ featured: true, limit: 3 });
  const { data: services } = useListServices();
  const { data: company } = useGetCompanyInfo();

  const statItems = [
    { label: "Projects Completed", value: stats?.projectCount || 120, icon: CheckCircle2 },
    { label: "Years of Experience", value: 15, icon: Building2 },
    { label: "Team Members", value: stats?.teamCount || 25, icon: Users },
    { label: "Awards Won", value: 12, icon: Award },
  ];

  const serviceIcons: Record<string, any> = {
    architecture: Building2,
    interior: Lightbulb,
    design: Compass,
    construction: Hammer,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {statItems.map((item, index) => (
              <FadeIn key={item.label} delay={index * 0.1}>
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl">
                    <item.icon className="text-secondary w-8 h-8" />
                  </div>
                  <div className="text-4xl md:text-5xl font-serif font-bold text-secondary">
                    <Counter value={item.value} />+
                  </div>
                  <p className="text-white/60 font-medium uppercase tracking-wider text-xs md:text-sm">
                    {item.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About Overview */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <FadeIn direction="right" className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <img 
                  src="https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=1000" 
                  alt="Modern Building" 
                  className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-[4/5]"
                />
                <div className="absolute bottom-8 -right-8 bg-white p-8 rounded-xl shadow-xl z-20 hidden md:block border-l-4 border-secondary">
                  <p className="font-serif text-3xl font-bold text-primary">15+</p>
                  <p className="text-muted-foreground text-sm uppercase tracking-widest">Years of Craft</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-secondary border-secondary py-1 px-4 text-xs font-bold uppercase tracking-widest">
                  Our Story
                </Badge>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">
                  Design That Inspires, <br />
                  <span className="text-secondary">Excellence That Lasts</span>
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {company?.about || "Since our inception, we have been committed to pushing the boundaries of architectural design. Our approach combines artistic vision with technical precision to create spaces that are both beautiful and functional."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {["Innovative Design", "Sustainable Solutions", "Precision Construction", "Client-Focused Approach"].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="text-secondary w-5 h-5 shrink-0" />
                    <span className="font-medium text-primary">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/about">
                <Button className="group bg-primary text-white hover:bg-primary/90 px-8 py-6 h-auto text-lg">
                  Learn More About Us
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <FadeIn className="max-w-2xl space-y-4">
              <Badge variant="outline" className="text-secondary border-secondary py-1 px-4 text-xs font-bold uppercase tracking-widest">
                Portfolio
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
                Featured Projects
              </h2>
            </FadeIn>
            <FadeIn>
              <Link href="/portfolio">
                <Button variant="link" className="text-secondary font-bold text-lg group p-0">
                  View Full Portfolio <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects?.data.map((project, index) => (
              <FadeIn key={project.id} delay={index * 0.1} direction="up">
                <Link href={`/portfolio/${project.id}`}>
                  <Card className="group overflow-hidden border-0 shadow-lg cursor-pointer h-full bg-white transition-all hover:shadow-2xl">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={project.coverImage || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800"} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                        <Button className="bg-secondary text-primary font-bold">View Details</Button>
                      </div>
                      <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">{project.category}</Badge>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-xl font-serif font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-1">
                        <Compass className="w-3 h-3" /> {project.location || "Location TBD"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <FadeIn>
              <Badge variant="outline" className="text-secondary border-secondary py-1 px-4 text-xs font-bold uppercase tracking-widest">
                What We Do
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-4">
                Our Expert Services
              </h2>
              <p className="text-lg text-muted-foreground mt-6">
                Comprehensive architectural and construction solutions designed to meet the highest standards of quality and aesthetics.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services?.map((service, index) => {
              const Icon = serviceIcons[service.icon.toLowerCase()] || Building2;
              return (
                <FadeIn key={service.id} delay={index * 0.1}>
                  <div className="group p-10 bg-white border border-border rounded-2xl transition-all duration-300 hover:border-secondary hover:shadow-xl h-full flex flex-col items-center text-center">
                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl group-hover:bg-secondary/10 transition-colors">
                      <Icon className="w-10 h-10 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-primary mb-4">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                      {service.description.length > 100 
                        ? `${service.description.substring(0, 100)}...` 
                        : service.description}
                    </p>
                    <Link href="/services">
                      <Button variant="ghost" className="text-primary hover:text-secondary font-bold group/btn p-0 h-auto">
                        Learn More <ArrowRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <FadeIn>
              <Badge className="bg-secondary text-primary hover:bg-secondary/90 py-1 px-4 text-xs font-bold uppercase tracking-widest border-0">
                Testimonials
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4">What Our Clients Say</h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                quote: "Forth Architecture transformed our vision into a stunning reality. Their attention to detail is unmatched in the industry.",
                author: "Robert Williams",
                role: "Real Estate Developer"
              },
              {
                quote: "Working with the team was a seamless experience. From design to construction, they were professional and highly skilled.",
                author: "Elena Petrova",
                role: "Luxury Homeowner"
              },
              {
                quote: "The innovative solutions they provided for our commercial project were both aesthetic and cost-effective. Highly recommend.",
                author: "James Chen",
                role: "CEO, TechPark Hub"
              }
            ].map((t, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="space-y-6 p-8 bg-white/5 rounded-2xl relative border border-white/10 hover:border-secondary transition-colors">
                  <div className="text-secondary text-5xl font-serif absolute -top-4 -left-2">“</div>
                  <p className="text-lg italic text-white/80 leading-relaxed relative z-10">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary">
                      {t.author[0]}
                    </div>
                    <div>
                      <h4 className="font-bold">{t.author}</h4>
                      <p className="text-sm text-white/50">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="bg-primary rounded-3xl overflow-hidden relative p-12 md:p-24 flex flex-col items-center text-center">
              <div 
                className="absolute inset-0 opacity-20 z-0"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1500')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="relative z-10 space-y-8 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white">
                  Ready to Start Your <span className="text-secondary">Next Project?</span>
                </h2>
                <p className="text-xl text-white/70">
                  Join hundreds of satisfied clients and let us build your future together.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-10 h-16 text-xl rounded-xl w-full sm:w-auto">
                      Contact Us Now
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold px-10 h-16 text-xl rounded-xl w-full sm:w-auto">
                      Our Projects
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}