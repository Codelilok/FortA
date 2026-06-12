import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitContact, useGetCompanyInfo } from "@workspace/api-client-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "wouter";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const { data: company } = useGetCompanyInfo();
  const submitContact = useSubmitContact();
  const search = useSearch();
  const serviceParam = new URLSearchParams(search).get("service");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: serviceParam ? `Inquiry about: ${serviceParam}` : "",
      message: serviceParam ? `I'd like to discuss your ${serviceParam} service.` : "",
    },
  });

  const onSubmit = (values: ContactFormValues) => {
    submitContact.mutate({ data: values }, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "There was a problem sending your message. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <FadeIn direction="up" className="max-w-2xl">
            <Badge className="bg-secondary text-primary hover:bg-secondary/90 py-1 px-4 text-xs font-bold uppercase tracking-widest border-0 mb-6">
              Connect With Us
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              Let's Design Your <span className="text-secondary">Future Together</span>
            </h1>
            <p className="text-lg text-white/60 mt-6">
              Have a question or a project idea? Reach out to our team of experts and let's start a conversation.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <FadeIn direction="right" className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-border">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold text-primary">Send Us a Message</h2>
                  <p className="text-muted-foreground">We typically respond within 24 hours.</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-bold">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="bg-gray-50 border-border focus:border-secondary h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-bold">Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} className="bg-gray-50 border-border focus:border-secondary h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-bold">Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 000-0000" {...field} className="bg-gray-50 border-border focus:border-secondary h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-bold">Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Project Inquiry" {...field} className="bg-gray-50 border-border focus:border-secondary h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-bold">Your Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your project..." 
                              className="min-h-[150px] bg-gray-50 border-border focus:border-secondary resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-white hover:bg-primary/90 font-bold h-14 rounded-xl text-lg group"
                      disabled={submitContact.isPending}
                    >
                      {submitContact.isPending ? "Sending..." : "Send Message"}
                      <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </form>
                </Form>
              </div>
            </FadeIn>

            {/* Contact Info */}
            <FadeIn direction="left" className="space-y-12 lg:pl-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-primary">Contact Information</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Prefer a direct chat? You can reach us via any of the channels below. Our team is always ready to assist you.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-secondary/10 transition-colors shrink-0">
                    <MapPin className="text-primary group-hover:text-secondary transition-colors" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-widest text-xs mb-1">Our Studio</h4>
                    <p className="text-lg text-muted-foreground">{company?.address || "123 Architectural Way, Design District, NY 10001"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-secondary/10 transition-colors shrink-0">
                    <Phone className="text-primary group-hover:text-secondary transition-colors" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-widest text-xs mb-1">Call Us</h4>
                    <p className="text-lg text-muted-foreground">{company?.phone || "+1 (555) 123-4567"}</p>
                    {company?.whatsapp && (
                      <p className="text-sm text-secondary font-bold mt-1 flex items-center gap-1">
                        <CheckCircle2 size={14} /> WhatsApp Available: {company.whatsapp}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-secondary/10 transition-colors shrink-0">
                    <Mail className="text-primary group-hover:text-secondary transition-colors" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-widest text-xs mb-1">Email Us</h4>
                    <p className="text-lg text-muted-foreground">{company?.email || "hello@fortharchitecture.com"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-secondary/10 transition-colors shrink-0">
                    <Clock className="text-primary group-hover:text-secondary transition-colors" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-widest text-xs mb-1">Working Hours</h4>
                    <p className="text-lg text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Sat - Sun: Closed</p>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              {company?.mapEmbedUrl ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-border">
                  <iframe
                    src={company.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border shadow-lg bg-primary relative flex flex-col items-center justify-center text-center p-8 gap-4">
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                      backgroundSize: "32px 32px"
                    }}
                  />
                  <div className="relative z-10 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center mx-auto">
                      <MapPin className="text-secondary" size={28} />
                    </div>
                    <p className="text-white font-serif text-xl font-bold">Find Us Here</p>
                    <p className="text-white/70 text-sm max-w-xs leading-relaxed">
                      {company?.address || "15 Independence Avenue, Accra, Ghana"}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(company?.address || "Accra, Ghana")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-secondary text-sm font-bold hover:underline"
                    >
                      Open in Google Maps <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}