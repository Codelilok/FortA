import { Link } from "wouter";
import { useListSocialLinks, useGetCompanyInfo } from "@workspace/api-client-react";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail,
  ArrowRight
} from "lucide-react";

export function Footer() {
  const { data: company } = useGetCompanyInfo();
  const { data: socialLinks } = useListSocialLinks();

  const socialIcons: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    x: Twitter,
  };

  return (
    <footer className="bg-primary text-white py-16 md:py-24 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-serif font-black text-primary text-xl shrink-0">F</div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base leading-tight tracking-wide">FORTH ARCHITECTURE</span>
                <span className="text-[10px] tracking-widest uppercase text-white/60">Consulting &amp; Construction Ltd</span>
              </div>
            </Link>
            <p className="text-white/70 max-w-xs leading-relaxed">
              {company?.slogan || "Crafting exceptional architectural experiences through innovative design and precision construction."}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks?.map((link) => {
                const Icon = socialIcons[link.platform.toLowerCase()] || Linkedin;
                return (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 rounded-full hover:bg-secondary transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-semibold text-secondary">Quick Links</h4>
            <ul className="space-y-4">
              {["About", "Services", "Portfolio", "Gallery", "Team"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase()}`}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-semibold text-secondary">Contact Us</h4>
            <ul className="space-y-4">
              {company?.address && (
                <li className="flex items-start gap-3 text-white/70">
                  <MapPin size={20} className="text-secondary shrink-0" />
                  <span>{company.address}</span>
                </li>
              )}
              {company?.phone && (
                <li className="flex items-center gap-3 text-white/70">
                  <Phone size={20} className="text-secondary shrink-0" />
                  <span>{company.phone}</span>
                </li>
              )}
              {company?.email && (
                <li className="flex items-center gap-3 text-white/70">
                  <Mail size={20} className="text-secondary shrink-0" />
                  <span>{company.email}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-semibold text-secondary">Get In Touch</h4>
            <p className="text-white/70 leading-relaxed">
              Have a project in mind? Let's discuss how we can bring your vision to life.
            </p>
            <Link href="/contact">
              <button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02]">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-sm">
          <p>© {new Date().getFullYear()} Forth Architecture Consulting & Construction Ltd. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}