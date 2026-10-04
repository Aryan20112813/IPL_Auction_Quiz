import React from "react";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  limit: number;
  offset: number;
  total: number;
  onPageChange: (newOffset: number) => void;
}

export function Pagination({
  limit,
  offset,
  total,
  onPageChange,
}: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const hasPrev = offset > 0;
  const hasNext = offset + limit < total;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 py-3 w-full border-t border-navy-800/80">
      <span className="text-xs text-slate-400">
        Showing {offset + 1}–{Math.min(offset + limit, total)} of {total}
      </span>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasPrev}
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          className="h-9 px-3"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Prev
        </Button>
        <span className="text-xs font-mono font-bold text-slate-300 px-2">
          {currentPage} / {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => onPageChange(offset + limit)}
          className="h-9 px-3"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
