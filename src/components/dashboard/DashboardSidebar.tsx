import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  Plus,
  Shield,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: FileText, label: 'Pages', href: '/dashboard/pages' },
  { icon: Users, label: 'Subscribers', href: '/dashboard/subscribers' },
  { icon: MessageSquare, label: 'Contacts', href: '/dashboard/contacts' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
];

const bottomNavItems = [
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

interface DashboardSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function DashboardSidebar({ 
  collapsed = false, 
  onCollapsedChange,
  mobileOpen = false,
  onMobileOpenChange,
}: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const isMobile = useIsMobile();

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile) {
      onMobileOpenChange?.(false);
    }
  };

  const NavLink = ({ item, isActive }: { item: typeof navItems[0]; isActive: boolean }) => {
    const content = (
      <button
        onClick={() => handleNavigation(item.href)}
        className={cn(
          'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full',
          'transition-all duration-200 ease-out',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-primary" />
        )}
        <item.icon className={cn('h-[18px] w-[18px] flex-shrink-0', isCollapsed && !isMobile && 'mx-auto')} />
        {(!isCollapsed || isMobile) && <span>{item.label}</span>}
      </button>
    );

    if (isCollapsed && !isMobile) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 border-b border-sidebar-border',
        isCollapsed && !isMobile ? 'justify-center px-2' : 'px-5'
      )}>
        <Link to="/" className="flex items-center gap-2.5" onClick={() => onMobileOpenChange?.(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-sm">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="text-lg font-bold tracking-tight">LeadCapture</span>
          )}
        </Link>
      </div>

      {/* Create Button */}
      <div className={cn('p-3', isCollapsed && !isMobile ? 'px-2' : 'px-4')}>
        {isCollapsed && !isMobile ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="w-full h-10 gradient-primary btn-lift rounded-xl"
                onClick={() => handleNavigation('/dashboard/pages/new')}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Create Page</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            className="w-full gradient-primary btn-lift rounded-xl h-10"
            onClick={() => handleNavigation('/dashboard/pages/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Page
          </Button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className={cn('flex-1 py-2 space-y-1', isCollapsed && !isMobile ? 'px-2' : 'px-3')}>
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

          return <NavLink key={item.href} item={item} isActive={isActive} />;
        })}

        {/* Admin Link */}
        {isAdmin && (
          <NavLink
            item={{ icon: Shield, label: 'Admin', href: '/admin' }}
            isActive={location.pathname.startsWith('/admin')}
          />
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className={cn('py-2 space-y-1 border-t border-sidebar-border', isCollapsed && !isMobile ? 'px-2' : 'px-3')}>
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return <NavLink key={item.href} item={item} isActive={isActive} />;
        })}
      </div>

      {/* User Section */}
      <div className={cn(
        'border-t border-sidebar-border',
        isCollapsed && !isMobile ? 'p-2' : 'p-4'
      )}>
        {isCollapsed && !isMobile ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-sidebar-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1">
              <p className="font-medium">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm flex-shrink-0">
              {profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-sidebar-muted truncate">{profile?.email}</p>
            </div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground flex-shrink-0"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign Out</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );

  // Mobile: Use Sheet
  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border',
        'hidden md:flex flex-col transition-all duration-300 ease-out-expo z-40',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <SidebarContent />

      {/* Collapse Toggle */}
      <button
        onClick={handleCollapse}
        className={cn(
          'absolute -right-3 top-20 z-50',
          'flex h-6 w-6 items-center justify-center rounded-full',
          'bg-card border border-border shadow-sm',
          'text-muted-foreground hover:text-foreground',
          'transition-all duration-200 hover:scale-110'
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  );
}

// Export the hamburger menu button for use in header
export function MobileMenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden h-10 w-10 rounded-xl"
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
