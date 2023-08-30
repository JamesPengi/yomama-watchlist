import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type InitialTableState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Skeleton } from "./skeleton";

interface DataTableLoaderProps<TData, TValue> {
  numberOfSkeletons: number;
  columns: ColumnDef<TData, TValue>[];
  initialState: InitialTableState;
}

export function DataTableLoader<TData, TValue>({
  columns,
  numberOfSkeletons,
  initialState,
}: DataTableLoaderProps<TData, TValue>) {
  const table = useReactTable({
    data: [],
    columns,
    initialState,
    getCoreRowModel: getCoreRowModel(),
  });
  const generateSkeletons = (numberOfSkeletons: number): JSX.Element[] => {
    const elements = [];

    for (let index = 0; index < numberOfSkeletons; index++) {
      elements.push(
        <TableRow key={index}>
          {table.getFlatHeaders().map((header) => {
            return (
              <TableCell key={header.id}>
                <Skeleton className="h-6 rounded" />
              </TableCell>
            );
          })}
        </TableRow>
      );
    }

    return elements;
  };
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={crypto.randomUUID()}>
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
      <TableBody>{generateSkeletons(numberOfSkeletons)}</TableBody>
    </Table>
  );
}
