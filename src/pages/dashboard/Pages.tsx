import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePages } from '@/hooks/usePages';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  FileText,
  Loader2,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const templateLabels: Record<string, string> = {
  newsletter: 'Newsletter',
  waitlist: 'Waitlist',
  event: 'Event',
  product_launch: 'Product',
  free_resource: 'Resource',
};

const templateColors: Record<string, string> = {
  newsletter: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  waitlist: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  event: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  product_launch: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  free_resource: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
};

export default function Pages() {
  const { pages, isLoading, deletePage } = usePages();
  const { subscribers } = useSubscribers();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getSubscriberCount = (pageId: string) => {
    return subscribers.filter((s) => s.page_id === pageId).length;
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied!',
      description: 'The page URL has been copied to your clipboard.',
    });
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm('Are you sure you want to delete this page? This will also delete all subscribers.')
    ) {
      return;
    }

    try {
      await deletePage(id);
      toast({
        title: 'Page deleted',
        description: 'The page has been permanently deleted.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the page.',
      });
    }
  };

  return (
    <DashboardLayout
      title="Pages"
      description="Create and manage your signup pages."
      actions={
        <Button
          onClick={() => navigate('/dashboard/pages/new')}
          className="gradient-primary btn-lift rounded-xl h-10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Page
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading pages...</p>
          </div>
        </div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No pages yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create your first signup page to start capturing leads from your audience.
          </p>
          <Button
            onClick={() => navigate('/dashboard/pages/new')}
            className="gradient-primary btn-lift rounded-xl h-11 px-6"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Page
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={cn(
                'group relative rounded-2xl bg-card border border-border/50 p-6',
                'transition-all duration-300 ease-out card-hover',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-semibold text-lg truncate mb-1">{page.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">/p/{page.slug}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                      <DropdownMenuItem
                        onClick={() => window.open(`/p/${page.slug}`, '_blank')}
                        className="rounded-lg cursor-pointer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Page
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCopyLink(page.slug)}
                        className="rounded-lg cursor-pointer"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/dashboard/pages/${page.id}/edit`)}
                        className="rounded-lg cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(page.id)}
                        className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-5 line-clamp-2 min-h-[40px]">
                  {page.description || 'No description added'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={cn('rounded-lg font-medium', templateColors[page.template])}
                  >
                    {templateLabels[page.template]}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{getSubscriberCount(page.id)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
