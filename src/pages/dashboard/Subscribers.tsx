import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  SubscriberStats,
  SubscriberFilters,
  SubscriberTable,
  SubscriberDetailModal,
  BulkActionsBar,
  PageInsights,
} from '@/components/subscribers';
import { useSubscribers, Subscriber } from '@/hooks/useSubscribers';
import { usePages } from '@/hooks/usePages';
import { Download, Loader2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';

const PAGE_SIZE = 10;

export default function Subscribers() {
  const [search, setSearch] = useState('');
  const [pageFilter, setPageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailSubscriber, setDetailSubscriber] = useState<Subscriber | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { 
    subscribers, 
    isLoading, 
    exportToCSV, 
    deleteSubscriber, 
    updateSubscriber,
    bulkUpdateTags,
    bulkDelete,
    exportSelectedToCSV,
  } = useSubscribers();
  const { pages } = usePages();
  const { toast } = useToast();

  // Filter and sort subscribers
  const filteredSubscribers = useMemo(() => {
    let result = subscribers.filter((sub) => {
      // Search filter
      const matchesSearch =
        sub.name.toLowerCase().includes(search.toLowerCase()) ||
        sub.email.toLowerCase().includes(search.toLowerCase());
      
      // Page filter
      const matchesPage = pageFilter === 'all' || sub.page_id === pageFilter;
      
      // Status filter
      const status = sub.status || 'active';
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      
      // Date range filter
      let matchesDate = true;
      if (dateRange?.from) {
        const subDate = new Date(sub.created_at);
        matchesDate = isAfter(subDate, startOfDay(dateRange.from));
        if (dateRange.to) {
          matchesDate = matchesDate && isBefore(subDate, endOfDay(dateRange.to));
        }
      }

      return matchesSearch && matchesPage && matchesStatus && matchesDate;
    });

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'created_at':
        default:
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [subscribers, search, pageFilter, statusFilter, dateRange, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscribers.length / PAGE_SIZE);
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasActiveFilters = search !== '' || pageFilter !== 'all' || statusFilter !== 'all' || dateRange !== undefined;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setPageFilter('all');
    setStatusFilter('all');
    setDateRange(undefined);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      await deleteSubscriber(id);
      toast({
        title: 'Subscriber deleted',
        description: 'The subscriber has been removed.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete subscriber.',
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: 'active' | 'unsubscribed') => {
    try {
      await updateSubscriber(id, { status });
      toast({
        title: 'Status updated',
        description: `Subscriber marked as ${status}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update status.',
      });
    }
  };

  const handleViewSubscriber = (subscriber: Subscriber) => {
    setDetailSubscriber(subscriber);
    setDetailOpen(true);
  };

  const handleUpdateSubscriber = async (id: string, data: { name?: string; email?: string; tags?: string[]; notes?: string; status?: string }) => {
    try {
      await updateSubscriber(id, data);
      toast({
        title: 'Subscriber updated',
        description: 'Changes saved successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update subscriber.',
      });
    }
  };

  const handleBulkAddTag = async (tag: string) => {
    try {
      await bulkUpdateTags(Array.from(selectedIds), tag);
      toast({
        title: 'Tags added',
        description: `Added "${tag}" to ${selectedIds.size} subscribers.`,
      });
      setSelectedIds(new Set());
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add tags.',
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDelete(Array.from(selectedIds));
      toast({
        title: 'Subscribers deleted',
        description: `Removed ${selectedIds.size} subscribers.`,
      });
      setSelectedIds(new Set());
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete subscribers.',
      });
    }
  };

  const handleExportSelected = () => {
    exportSelectedToCSV(Array.from(selectedIds));
    toast({
      title: 'Export complete',
      description: `Exported ${selectedIds.size} subscribers to CSV.`,
    });
  };

  const pagesForFilter = pages.map(p => ({ id: p.id, title: p.title }));

  return (
    <DashboardLayout
      title="Subscribers"
      description="Manage and organize your collected leads."
      actions={
        <Button 
          onClick={exportToCSV} 
          variant="outline" 
          disabled={subscribers.length === 0}
          className="rounded-xl h-10"
        >
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading subscribers...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <SubscriberStats subscribers={subscribers} pages={pagesForFilter} />

          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Filters */}
              <SubscriberFilters
                search={search}
                onSearchChange={setSearch}
                pageFilter={pageFilter}
                onPageFilterChange={setPageFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                pages={pagesForFilter}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />

              {/* Table or Empty State */}
              {filteredSubscribers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center rounded-2xl border border-border/50 bg-card">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">No subscribers yet</h3>
                  <p className="text-muted-foreground text-center text-sm max-w-sm px-4">
                    {hasActiveFilters
                      ? 'No subscribers match your filters. Try adjusting your search criteria.'
                      : 'Share your signup pages to start collecting subscribers.'}
                  </p>
                </div>
              ) : (
                <SubscriberTable
                  subscribers={paginatedSubscribers}
                  selectedIds={selectedIds}
                  onSelectChange={setSelectedIds}
                  onViewSubscriber={handleViewSubscriber}
                  onDeleteSubscriber={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={PAGE_SIZE}
                  totalCount={filteredSubscribers.length}
                />
              )}
            </div>

            {/* Sidebar Insights - hidden on mobile, shown on xl+ */}
            {subscribers.length > 0 && (
              <div className="hidden xl:block w-72 shrink-0">
                <PageInsights subscribers={subscribers} pages={pagesForFilter} />
              </div>
            )}
          </div>

          {/* Subscriber Detail Modal */}
          <SubscriberDetailModal
            subscriber={detailSubscriber}
            open={detailOpen}
            onOpenChange={setDetailOpen}
            onUpdate={handleUpdateSubscriber}
          />

          {/* Bulk Actions Bar */}
          {selectedIds.size > 0 && (
            <BulkActionsBar
              selectedCount={selectedIds.size}
              onClear={() => setSelectedIds(new Set())}
              onExportSelected={handleExportSelected}
              onAddTagToSelected={handleBulkAddTag}
              onDeleteSelected={handleBulkDelete}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
