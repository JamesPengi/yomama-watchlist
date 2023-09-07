import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import { Skeleton } from "~/app/_components/ui/skeleton";

export default function Loading() {
  const generateRows = () => {
    const elements = [];
    for (let i = 0; i < 10; i++) {
      elements.push(
        <TableRow key={i}>
          <TableCell>
            <div className="w-[60px]">
              <Skeleton className="h-8 w-full rounded" />
            </div>
          </TableCell>
          <TableCell>
            <div className="w-[600px]">
              <Skeleton className="h-8 w-full rounded" />
            </div>
          </TableCell>
          <TableCell>
            <div className="w-[150px]">
              <Skeleton className="h-8 w-full rounded" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-full rounded-full" />
          </TableCell>
        </TableRow>
      );
    }

    return elements;
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-row justify-between">
        <Skeleton className="ml-4 h-8 w-1/2 rounded" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Type</TableHead>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Genre</TableHead>
            <TableHead className="font-bold">Watched</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{generateRows()}</TableBody>
      </Table>
      <div className="ml-4 flex flex-row justify-between">
        <Skeleton className="h-8 w-1/4 rounded" />
        <Skeleton className="h-8 w-1/4 rounded" />
        <Skeleton className="h-8 w-1/4 rounded" />
      </div>
    </div>
  );
}
