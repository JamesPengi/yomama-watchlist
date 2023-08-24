import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { api } from "~/utils/api";
import { Button } from "./button";
import { Title } from "~/db/schema";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./input";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const formSchema = z.object({
  ratings: z.string().min(1, {
    message: "Please enter at least one digit",
  }),
  description: z.string().min(2, {
    message: "Please enter a description with at least two characters",
  }),
});

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const title = row.original as Title;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ratings: "", description: "" },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    markAsWatched.mutate({
      name: title.name,
      userDescription: data.description,
      userRating: Number(data.ratings),
    });
  };

  const queryContext = api.useContext();
  const markAsNotWatched = api.titles.markAsNotWatched.useMutation({
    onSuccess() {
      queryContext.titles.invalidate();
    },
  });
  const markAsWatched = api.titles.markAsWatched.useMutation({
    onSuccess() {
      queryContext.titles.invalidate();
      setDialogOpen(false);
    },
  });
  const deleteTitle = api.titles.delete.useMutation({
    onSuccess() {
      queryContext.titles.invalidate();
    },
  });

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Title Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {title.isWatched ? (
            <DropdownMenuItem
              onClick={() =>
                markAsNotWatched.mutate({
                  name: title.name,
                })
              }
            >
              Mark as not watched
            </DropdownMenuItem>
          ) : (
            <DialogTrigger asChild>
              <DropdownMenuItem>Mark as Watched</DropdownMenuItem>
            </DialogTrigger>
          )}

          <DropdownMenuItem
            className="text-red-500 focus:bg-red-500 focus:text-white"
            onClick={() => deleteTitle.mutate(title.name)}
          >
            Delete title
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title.name}</DialogTitle>
          <DialogDescription>
            Enter your rating, and phrase to describe {title.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-5 pb-5 pt-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="w-2/3 space-y-3">
              <FormField
                control={form.control}
                name="ratings"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="font-bold">Rating</FormLabel>
                      <FormControl>
                        <Input placeholder="6.9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="font-bold">Description</FormLabel>
                      <FormControl>
                        <Input
                          type="name"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Mark as Watched</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
