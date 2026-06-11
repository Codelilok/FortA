import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Show } from "@clerk/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Gallery", href: "/gallery" },
  { name: "Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-md py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <span className={cn(
              "font-serif font-bold text-lg leading-tight transition-colors",
              isScrolled ? "text-primary" : "text-white"
            )}>
              FORTH
            </span>
            <span className={cn(
              "text-[10px] tracking-widest uppercase transition-colors",
              isScrolled ? "text-muted-foreground" : "text-white/80"
            )}>
              Architecture
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary relative py-1",
                location === link.href 
                  ? "text-secondary" 
                  : isScrolled ? "text-primary" : "text-white",
                location === link.href && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Show when="signed-in">
            <Link 
              href="/admin"
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary",
                isScrolled ? "text-primary" : "text-white"
              )}
            >
              Admin
            </Link>
          </Show>
          <Link href="/contact">
            <Button 
              variant="outline" 
              className={cn(
                "border-secondary text-secondary hover:bg-secondary hover:text-white",
                !isScrolled && "bg-transparent border-white text-white hover:bg-white hover:text-primary"
              )}
            >
              Start a Project
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? "text-primary" : "text-white"} />
          ) : (
            <Menu className={isScrolled ? "text-primary" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-border shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-lg font-medium p-2 rounded-lg",
                  location === link.href ? "bg-secondary/10 text-secondary" : "text-primary"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Show when="signed-in">
              <Link 
                href="/admin"
                className="text-lg font-medium p-2 rounded-lg text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </Show>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-primary text-white">Start a Project</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}