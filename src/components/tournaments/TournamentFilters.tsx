import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { TournamentCategory, BallType, TournamentStatus, getCategoryLabel, getBallTypeLabel, getStatusLabel } from "@/data/mockData";

interface TournamentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: TournamentCategory | null;
  onCategoryChange: (category: TournamentCategory | null) => void;
  selectedBallType: BallType | null;
  onBallTypeChange: (ballType: BallType | null) => void;
  selectedStatus: TournamentStatus | null;
  onStatusChange: (status: TournamentStatus | null) => void;
}

const categories: TournamentCategory[] = ['open', 'corporate', 'school', 'college', 'society', 'locality'];
const ballTypes: BallType[] = ['tennis', 'leather', 'tennis-tape', 'leather-white'];
const statuses: TournamentStatus[] = ['registration', 'auction', 'live', 'completed'];

export function TournamentFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBallType,
  onBallTypeChange,
  selectedStatus,
  onStatusChange,
}: TournamentFiltersProps) {
  const hasFilters = selectedCategory || selectedBallType || selectedStatus || searchQuery;

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
    onBallTypeChange(null);
    onStatusChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tournaments..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Sections */}
      <div className="space-y-3">
        {/* Category Filter */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onCategoryChange(selectedCategory === category ? null : category)}
              >
                {getCategoryLabel(category)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Ball Type Filter */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Ball Type</p>
          <div className="flex flex-wrap gap-2">
            {ballTypes.map((ballType) => (
              <Badge
                key={ballType}
                variant={selectedBallType === ballType ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onBallTypeChange(selectedBallType === ballType ? null : ballType)}
              >
                {getBallTypeLabel(ballType)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Badge
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => onStatusChange(selectedStatus === status ? null : status)}
              >
                {getStatusLabel(status)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}
