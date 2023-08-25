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
import type { Title, User } from "~/db/drizzle";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./input";
import { Checkbox } from "./checkbox";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  userData: User[];
}

const formSchema = z.object({
  users: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least 1 person who watched it",
  }),
  ratings: z.string().min(1, {
    message: "Please enter at least one digit",
  }),
  description: z.string().min(2, {
    message: "Please enter a description with at least two characters",
  }),
});

export function DataTableRowActions<TData>({
  row,
  userData,
}: DataTableRowActionsProps<TData>) {
  const title = row.original as Title;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { users: ["Jassem"], ratings: "", description: "" },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const usersWatched = userData.filter((user) => {
      for (const userData of data.users) {
        if (userData === user.name) {
          return true;
        }
      }
    });

    if (!Number.isNaN(data.ratings)) {
      markAsWatched.mutate({
        titleId: title.id,
        userDescription: data.description,
        userRating: data.ratings,
        usersWatched: usersWatched,
      });
    }
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
          <DropdownMenuLabel className="text-center">Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {title.isWatched ? (
            <DropdownMenuItem
              onClick={() =>
                markAsNotWatched.mutate({
                  id: title.id,
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
            Enter who watched {title.name} your rating, and phrase to describe
            it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-5 pb-5 pt-2"
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <div className="w-2/3 space-y-5">
              <FormField
                control={form.control}
                name="users"
                render={() => {
                  return (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="font-bold">
                          People Watched
                        </FormLabel>
                        <FormDescription>
                          Select the people who watched this
                        </FormDescription>
                        <div className="mt-3 space-y-2">
                          {userData.map((user) => {
                            return (
                              <FormField
                                key={user.id}
                                control={form.control}
                                name="users"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={user.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value.includes(
                                            String(user.name)
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  user.name,
                                                ])
                                              : field.onChange(
                                                  field.value.filter(
                                                    (value) =>
                                                      value !==
                                                      String(user.name)
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel>{user.name}</FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            );
                          })}
                        </div>
                        <FormMessage className="mt-2" />
                      </div>
                    </FormItem>
                  );
                }}
              />
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
