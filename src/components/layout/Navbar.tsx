import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { name: 'Features', href: '/features' },
  { name: 'Use Cases', href: '/use-cases' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'py-3 glass border-b border-border/50 shadow-sm'
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="GrowthPages" className="h-9 w-9 object-contain transition-transform group-hover:scale-105" />
            <span className="text-xl font-bold tracking-tight">GrowthPages</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  location.pathname === link.href
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="font-medium"
                >
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="font-medium"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="gradient-primary btn-lift font-medium"
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu - Sheet Drawer */}
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="md:hidden p-2 rounded-lg transition-all duration-200 hover:bg-muted active:scale-95"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] pt-10">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2.5">
                    <img src={logo} alt="GrowthPages" className="h-8 w-8 object-contain" />
                    <span className="text-lg font-bold tracking-tight">GrowthPages</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        location.pathname === link.href
                          ? 'text-foreground bg-muted'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t border-border/50 space-y-2">
                  {user ? (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                      >
                        Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                      >
                        Log In
                      </Button>
                      <Button
                        className="w-full gradient-primary"
                        onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                      >
                        Get Started Free
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
