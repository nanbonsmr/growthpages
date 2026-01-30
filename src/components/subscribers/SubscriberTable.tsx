import { useState } from 'react';
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
      className="-ml-3 h-8 font-medium"
      onClick={() => onSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
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
              <TableHead>Source Page</TableHead>
              <TableHead>
                <SortHeader field="created_at">Signup Date</SortHeader>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow 
                key={subscriber.id}
                className="cursor-pointer"
                onClick={() => onViewSubscriber(subscriber)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(subscriber.id)}
                    onCheckedChange={(checked) => handleSelectOne(subscriber.id, checked as boolean)}
                    aria-label={`Select ${subscriber.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{subscriber.name}</TableCell>
                <TableCell className="text-muted-foreground">{subscriber.email}</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {subscriber.page?.title || 'Unknown'}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(subscriber.created_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={subscriber.status === 'active' ? 'default' : 'secondary'}
                    className={subscriber.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100'
                      : 'bg-muted text-muted-foreground'
                    }
                  >
                    {subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {subscriber.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {subscriber.tags && subscriber.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{subscriber.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewSubscriber(subscriber)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onUpdateStatus(
                          subscriber.id, 
                          subscriber.status === 'active' ? 'unsubscribed' : 'active'
                        )}
                      >
                        Mark as {subscriber.status === 'active' ? 'Unsubscribed' : 'Active'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex} to {endIndex} of {totalCount} subscribers
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
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
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  className="w-8"
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
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
