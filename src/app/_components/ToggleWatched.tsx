"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../_trpc/client";
import { useState } from "react";
import { Checkbox } from "~/app/_components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Button } from "~/app/_components/ui/button";
import { DialogHeader, DialogFooter } from "~/app/_components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "~/app/_components/ui/form";
import { CheckCircle, CircleDashed } from "lucide-react";
import type { User } from "~/db/drizzle";

interface MarkAsWatchedProps {
  titleId: number;
  titleName: string;
  isWatched: boolean;
  userData: User[];
  showDescription?: boolean;
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

export function ToggleWatched({
  titleId,
  titleName,
  userData,
  isWatched,
  showDescription = false,
}: MarkAsWatchedProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { users: ["Jassem"], ratings: "", description: "" },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (userData) {
      const usersWatched = userData.filter((user) => {
        for (const userData of data.users) {
          if (userData === user.name) {
            return true;
          }
        }
      });

      if (!Number.isNaN(data.ratings)) {
        markAsWatched.mutate({
          titleId: titleId,
          userDescription: data.description,
          userRating: data.ratings,
          usersWatched: usersWatched,
        });
      }
    }
  };

  const queryContext = trpc.useContext();

  const markAsWatched = trpc.titles.markAsWatched.useMutation({
    onSettled() {
      queryContext.titles.invalidate();
      form.reset();
      setDialogOpen(false);
    },
  });
  const markAsNotWatchedMutation = trpc.titles.markAsNotWatched.useMutation({
    onSuccess() {
      queryContext.titles.getOne.invalidate(String(titleId));
      queryContext.titles.getAll.invalidate();
    },
  });

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {isWatched ? (
        <Button
          variant="ghost"
          className="flex h-8 w-8 rounded-full p-0 data-[state=open]:bg-muted"
          onClick={() => markAsNotWatchedMutation.mutate({ id: titleId })}
        >
          <CheckCircle className="text-green-500" />
        </Button>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 rounded-full p-0 data-[state=open]:bg-muted"
          >
            <CircleDashed className="text-red-500" />
          </Button>
        </DialogTrigger>
      )}
      {showDescription && (
        <span className="text-[12px] text-muted-foreground">
          {!isWatched && `Not `}Watched
        </span>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titleName}</DialogTitle>
          <DialogDescription>
            Enter who watched {titleName} your rating, and phrase to describe
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
                          {userData?.map((user) => {
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
