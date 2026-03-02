
import { cn } from "@/lib/utils";
import { PaginationProps } from "@/types";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  pagination: PaginationProps;
}

export default function Pagination({ pagination }: Props) {
  const [pages, setPages] = useState<number[]>([]);
  const [previous, setPrevious] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  const setupPagination = () => {
    var rangePages = [];

    if (
      pagination.currentPage > 1 &&
      pagination.currentPage + 4 <= pagination.lastPage
    ) {
      rangePages.push(pagination.currentPage - 1);
    }

    if (pagination.currentPage + 3 >= pagination.lastPage) {

      var start =
        pagination.lastPage < 5
          ? pagination.lastPage - 4
          : pagination.lastPage - 5;
      var keys =
        pagination.lastPage <= 5
          ? pagination.lastPage
          : pagination.lastPage - start;
      var intervalos = [...Array(keys).keys()].map((index) => {
        return pagination.lastPage <= 5 ? index + 1 : index + 1 + start
      });

      setPages([...rangePages, ...intervalos]);
      return;
    }

    var endPagNum = pagination.currentPage === 1 ? 4 : 3;
    for (var index = 0; index <= endPagNum; index++) {
      rangePages.push(pagination.currentPage + index);
    }

    setPages(rangePages);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete('page');
    var queryTemp = params.size === 0 ? '?' : `?${params.toString()}&`;

    setupPagination();
    setQuery(queryTemp);
    if (pagination.currentPage > 1) {
      setPrevious(`${queryTemp}page=${pagination.currentPage - 1}`);
    }

    if (pagination.currentPage < pagination.lastPage) {
      setNext(`${queryTemp}page=${pagination.currentPage + 1}`);
    }

  }, [pagination]);

  return (
    <>
      <div className="flex justify-center items-center mt-4 gap-1">
        <Link
          href={`${query}page=1`}
          className={cn(previous === null && 'pointer-events-none opacity-50')}
        >
          <ChevronsLeft />
        </Link>
        <Link
          href={previous ?? '#'}
          className={cn(previous === null && 'pointer-events-none opacity-50')}
        >
          <ChevronLeft />
        </Link>
        {pages.map((page) => {
          return (
            <Link
              className={cn(
                'px-3 py-1 hover:bg-accent hover:text-accent-foreground border rounded hover:border-ring',
                pagination.currentPage === page && "bg-input text-accent-foreground"
              )}
              href={`${query}page=${page}`}
              key={page}
            >
              {page}
            </Link>
          );
        })}
        <Link
          href={next ?? '#'}
          className={cn(next === null && 'pointer-events-none opacity-50')}
        >
          <ChevronRight />
        </Link>
        <Link
          href={`${query}page=${pagination.lastPage}`}
          className={cn(next === null && 'pointer-events-none opacity-50')}
        >
          <ChevronsRight />
        </Link>
      </div>
    </>
  );
}