import { 
  useGetCompanyInfo, 
  useListTeamMembers 
} from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Eye, ShieldCheck, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { data: company, isLoading: companyLoading } = useGetCompanyInfo();
  const { data: team, isLoading: teamLoading } = useListTeamMembers();

  const values = [
    { title: "Our Mission", text: company?.mission || "To deliver exceptional architectural solutions that enhance the quality of life and work.", icon: Target },
    { title: "Our Vision", text: company?.vision || "To be a global leader in sustainable and innovative architecture and construction.", icon: Eye },
    { title: "Our Values", text: company?.values || "Integrity, Excellence, Innovation, and Sustainability in every project we undertake.", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(26, 39, 68, 0.9), rgba(26, 39, 68, 0.7)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <FadeIn direction="up">
            <Badge variant="outline" className="text-secondary border-secondary mb-4 py-1 px-4 text-xs font-bold uppercase tracking-widest">
              Who We Are
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">About Our Firm</h1>
          </FadeIn>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <FadeIn direction="right" className="lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1000" 
                  alt="Architecture Studio" 
                  className="rounded-2xl shadow-2xl relative z-10 w-full aspect-[4/3] object-cover"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
              </div>
            </FadeIn>
            <FadeIn direction="left" className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">The Forth Legacy</h2>
              {companyLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="prose prose-lg text-muted-foreground">
                  <p className="leading-relaxed">
                    {company?.about || "Founded on the principles of excellence and innovation, Forth Architecture Consulting & Construction Ltd has grown from a boutique design studio into a comprehensive architectural and construction powerhouse. Our journey is defined by the structures we build and the relationships we nurture."}
                  </p>
                  <p className="leading-relaxed">
                    We believe that architecture is more than just building; it's about creating environments that inspire human potential. Every project we undertake is a unique opportunity to blend aesthetic beauty with functional utility.
                  </p>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                  <div className="h-2 bg-secondary w-0 group-hover:w-full transition-all duration-500" />
                  <CardContent className="p-10 space-y-4">
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                      <item.icon className="w-8 h-8 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-primary">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <FadeIn>
              <Badge variant="outline" className="text-secondary border-secondary py-1 px-4 text-xs font-bold uppercase tracking-widest">
                Our Leadership
              </Badge>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">Meet the Visionaries</h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {teamLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))
            ) : (
              team?.slice(0, 3).map((member: any, index: number) => (
                <FadeIn key={member.id} delay={index * 0.1}>
                  <div className="group relative overflow-hidden rounded-2xl">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={member.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                      <h4 className="text-white text-xl font-bold">{member.name}</h4>
                      <p className="text-secondary text-sm font-medium uppercase tracking-widest">{member.position}</p>
                    </div>
                    <div className="p-6 bg-white border border-t-0 border-border rounded-b-2xl group-hover:border-secondary transition-colors">
                      <h4 className="text-primary text-xl font-bold mb-1">{member.name}</h4>
                      <p className="text-muted-foreground text-sm uppercase tracking-widest">{member.position}</p>
                    </div>
                  </div>
                </FadeIn>
              ))
            )}
          </div>

          <FadeIn className="text-center">
            <Link href="/team">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-bold px-10 h-14 rounded-xl group">
                Meet the Full Team <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}