import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Search, Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface SubscriberFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  pageFilter: string;
  onPageFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  pages: { id: string; title: string }[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function SubscriberFilters({
  search,
  onSearchChange,
  pageFilter,
  onPageFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  pages,
  onClearFilters,
  hasActiveFilters,
}: SubscriberFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 sm:h-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Page Filter */}
          <Select value={pageFilter} onValueChange={onPageFilterChange}>
            <SelectTrigger className="w-full xs:w-auto min-w-[140px] h-9 sm:h-10">
              <SelectValue placeholder="All Pages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[120px] sm:w-[140px] h-9 sm:h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-auto min-w-[140px] sm:min-w-[180px] h-9 sm:h-10 justify-start text-left font-normal text-sm">
                <CalendarIcon className="mr-1.5 sm:mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                      </>
                    ) : (
                      format(dateRange.from, 'MMM dd, yyyy')
                    )
                  ) : (
                    'Date Range'
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={1}
                className="sm:hidden"
              />
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
                className="hidden sm:block"
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" onClick={onClearFilters} className="h-9 sm:h-10 px-2 sm:px-3 shrink-0">
              <X className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
