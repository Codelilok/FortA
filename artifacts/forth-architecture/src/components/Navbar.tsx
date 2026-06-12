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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-serif font-black text-lg transition-all",
              isScrolled ? "bg-primary text-secondary" : "bg-secondary text-primary"
            )}>
              F
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className={cn(
              "font-serif font-bold text-sm tracking-tight transition-colors",
              isScrolled ? "text-primary" : "text-white"
            )}>
              FORTH ARCHITECTURE
            </span>
            <span className={cn(
              "text-[9px] tracking-widest uppercase transition-colors font-medium",
              isScrolled ? "text-muted-foreground" : "text-white/70"
            )}>
              CONSULTING & CONSTRUCTION LTD
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary relative py-1",
                location === link.href
                  ? "text-secondary"
                  : isScrolled ? "text-primary" : "text-white",
                location === link.href && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary after:rounded-full"
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
              size="sm"
              className={cn(
                "font-semibold transition-all",
                isScrolled
                  ? "bg-primary text-white hover:bg-secondary hover:text-primary"
                  : "bg-secondary text-primary hover:bg-white hover:text-primary"
              )}
            >
              Start a Project
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? "text-primary" : "text-white"} size={22} />
          ) : (
            <Menu className={isScrolled ? "text-primary" : "text-white"} size={22} />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-border shadow-2xl">
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base font-medium p-3 rounded-xl transition-all",
                  location === link.href
                    ? "bg-primary text-white"
                    : "text-primary hover:bg-gray-50"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Show when="signed-in">
              <Link
                href="/admin"
                className="text-base font-medium p-3 rounded-xl text-secondary hover:bg-secondary/10 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            </Show>
            <div className="pt-2 mt-2 border-t border-border">
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-white">Start a Project</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
