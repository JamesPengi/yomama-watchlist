"use client";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type InitialTableState,
  type Row,
} from "@tanstack/react-table";

import Image from "next/image";

import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import type { getAllResponse } from "~/types/ApiResponses";

import { Badge } from "./badge";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import Link from "next/link";
import { YoutubeIcon } from "lucide-react";

interface DataTableProps<TValue> {
  data: getAllResponse[];
  columns: ColumnDef<getAllResponse, TValue>[];
  initialState: InitialTableState;
}

export function DataTable<TValue>({
  data,
  columns,
  initialState,
}: DataTableProps<TValue>) {
  const table = useReactTable({
    data,
    columns,
    initialState,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody ref={parent}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<getAllResponse>) => {
                return (
                  <Dialog key={row.id}>
                    <DialogTrigger asChild>
                      <TableRow key={row.id} className="hover:cursor-pointer">
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="flex space-x-5">
                        <div className="min-w-[200px]">
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${row.original.tmdbPosterPath}`}
                            width={500}
                            height={500}
                            alt={`Movie poster of ${row.original.name}`}
                          />
                        </div>

                        <div className="space-y-5">
                          <div className="space-y-2">
                            <h4 className="text-2xl font-extrabold">
                              {row.getValue("name")}
                            </h4>
                            <Badge variant="default" className="uppercase">
                              {row.original.mediaType}
                            </Badge>
                          </div>
                          <ScrollArea className="h-32">
                            {row.original.tmdbOverview}
                          </ScrollArea>
                          <div className="space-y-2">
                            <Separator />
                            <div>
                              <Link
                                href={`https://www.youtube.com/results?search_query=${row.original.name} Official Trailer`}
                                target="_blank"
                              >
                                <div className="flex flex-col items-center">
                                  <YoutubeIcon className="h-10 w-10" />
                                  <span className="text-[12px]">Trailer</span>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nothing to show!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
