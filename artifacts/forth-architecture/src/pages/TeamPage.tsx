import { useListTeamMembers } from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Linkedin, Twitter, Mail } from "lucide-react";

export default function TeamPage() {
  const { data: team, isLoading } = useListTeamMembers();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn direction="up" className="max-w-2xl mx-auto space-y-6">
            <Badge className="bg-secondary text-primary hover:bg-secondary/90 py-1 px-4 text-xs font-bold uppercase tracking-widest border-0">
              Our People
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold">Meet Our Team</h1>
            <p className="text-lg text-white/60">
              A diverse group of passionate architects, designers, and engineers dedicated to building excellence.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-6">
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))
            ) : (
              team?.map((member: any, index: number) => (
                <FadeIn key={member.id} delay={index * 0.1}>
                  <div className="group space-y-6">
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
                      <img 
                        src={member.photo || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600`} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                        {member.linkedinUrl && (
                          <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-primary hover:bg-secondary hover:text-white transition-all transform hover:scale-110">
                            <Linkedin size={20} />
                          </a>
                        )}
                        {member.twitterUrl && (
                          <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-primary hover:bg-secondary hover:text-white transition-all transform hover:scale-110">
                            <Twitter size={20} />
                          </a>
                        )}
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="p-3 bg-white rounded-full text-primary hover:bg-secondary hover:text-white transition-all transform hover:scale-110">
                            <Mail size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif font-bold text-primary group-hover:text-secondary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-secondary font-bold uppercase tracking-widest text-sm">
                        {member.position}
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed italic">
                      {member.bio || "Bringing years of expertise and creative vision to every project, ensuring the highest standards of architectural excellence."}
                    </p>

                    <div className="h-1 bg-gray-100 w-full rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-0 group-hover:w-full transition-all duration-700" />
                    </div>
                  </div>
                </FadeIn>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}