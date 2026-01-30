import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const templateLabels: Record<string, string> = {
  newsletter: 'Newsletter',
  waitlist: 'Waitlist',
  event: 'Event',
  product_launch: 'Product Launch',
  free_resource: 'Free Resource',
};

export default function Pages() {
  const { pages, isLoading, deletePage } = usePages();
  const { subscribers } = useSubscribers();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getSubscriberCount = (pageId: string) => {
    return subscribers.filter(s => s.page_id === pageId).length;
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
    if (!confirm('Are you sure you want to delete this page? This will also delete all subscribers.')) {
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
      title="My Pages"
      description="Manage your signup pages and track their performance."
      actions={
        <Button onClick={() => navigate('/dashboard/pages/new')} className="gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create Page
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Create your first signup page to start capturing leads from your audience.
            </p>
            <Button onClick={() => navigate('/dashboard/pages/new')} className="gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="group hover:shadow-soft transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{page.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      /p/{page.slug}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(`/p/${page.slug}`, '_blank')}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Page
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyLink(page.slug)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/pages/${page.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(page.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {page.description || 'No description'}
                </p>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {templateLabels[page.template]}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {getSubscriberCount(page.id)} subscribers
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
