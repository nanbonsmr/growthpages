import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Subscriber } from '@/hooks/useSubscribers';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SubscriberTableProps {
  subscribers: Subscriber[];
  selectedIds: Set<string>;
  onSelectChange: (ids: Set<string>) => void;
  onViewSubscriber: (subscriber: Subscriber) => void;
  onDeleteSubscriber: (id: string) => void;
  onUpdateStatus: (id: string, status: 'active' | 'unsubscribed') => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalCount: number;
}

export function SubscriberTable({
  subscribers,
  selectedIds,
  onSelectChange,
  onViewSubscriber,
  onDeleteSubscriber,
  onUpdateStatus,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalCount,
}: SubscriberTableProps) {
  const allSelected = subscribers.length > 0 && subscribers.every(s => selectedIds.has(s.id));
  const someSelected = subscribers.some(s => selectedIds.has(s.id)) && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedIds);
      subscribers.forEach(s => newSelected.add(s.id));
      onSelectChange(newSelected);
    } else {
      const newSelected = new Set(selectedIds);
      subscribers.forEach(s => newSelected.delete(s.id));
      onSelectChange(newSelected);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    onSelectChange(newSelected);
  };

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 font-medium text-muted-foreground hover:text-foreground"
      onClick={() => onSort(field)}
    >
      {children}
      <ArrowUpDown className={cn(
        "ml-2 h-3.5 w-3.5 transition-colors",
        sortField === field ? "text-foreground" : "text-muted-foreground/50"
      )} />
    </Button>
  );

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) {
                      (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = someSelected;
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>
                <SortHeader field="name">Name</SortHeader>
              </TableHead>
              <TableHead>
                <SortHeader field="email">Email</SortHeader>
              </TableHead>
              <TableHead className="hidden md:table-cell">Source</TableHead>
              <TableHead className="hidden sm:table-cell">
                <SortHeader field="created_at">Date</SortHeader>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Tags</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber, index) => (
              <TableRow 
                key={subscriber.id}
                className={cn(
                  "cursor-pointer transition-colors table-row-hover",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 0.02}s` }}
                onClick={() => onViewSubscriber(subscriber)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(subscriber.id)}
                    onCheckedChange={(checked) => handleSelectOne(subscriber.id, checked as boolean)}
                    aria-label={`Select ${subscriber.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-medium flex-shrink-0">
                      {subscriber.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium truncate">{subscriber.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground truncate max-w-[200px]">
                  {subscriber.email}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-muted-foreground truncate">
                    {subscriber.page?.title || 'Unknown'}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                  {format(new Date(subscriber.created_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "rounded-lg font-medium",
                      subscriber.status === 'active' 
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-muted text-muted-foreground border-border'
                    )}
                  >
                    {subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {subscriber.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs rounded-md">
                        {tag}
                      </Badge>
                    ))}
                    {subscriber.tags && subscriber.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs rounded-md">
                        +{subscriber.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                      <DropdownMenuItem 
                        onClick={() => onViewSubscriber(subscriber)}
                        className="rounded-lg cursor-pointer"
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onUpdateStatus(
                          subscriber.id, 
                          subscriber.status === 'active' ? 'unsubscribed' : 'active'
                        )}
                        className="rounded-lg cursor-pointer"
                      >
                        Mark as {subscriber.status === 'active' ? 'Unsubscribed' : 'Active'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => onDeleteSubscriber(subscriber.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
          Showing <span className="font-medium text-foreground">{startIndex}</span> to{' '}
          <span className="font-medium text-foreground">{endIndex}</span> of{' '}
          <span className="font-medium text-foreground">{totalCount}</span>
        </p>
        <div className="flex items-center gap-1 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg text-xs sm:text-sm",
                    currentPage === pageNum && "gradient-primary"
                  )}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
