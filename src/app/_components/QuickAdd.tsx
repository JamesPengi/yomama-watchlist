"use client";

import { Input } from "./ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "./ui/form";
import { useEffect } from "react";
import { trpc } from "../_trpc/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter a title with at least two characters",
  }),
});

export function QuickAdd() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        form.setFocus("name");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [form]);

  const queryContext = trpc.useContext();
  const quickAdd = trpc.titles.quickAdd.useMutation({
    async onSuccess() {
      await queryContext.titles.invalidate();
      form.reset();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    quickAdd.mutate(values.name);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex-1"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="relative inline-flex w-full items-center rounded-md">
              <FormControl>
                <Input
                  type="name"
                  placeholder="Quick add title to watchlist"
                  className="inline-flex rounded border-none bg-gray-900 px-5 py-8 font-extrabold transition-colors focus:bg-gray-800"
                  {...field}
                />
              </FormControl>
              <div className="absolute right-1.5 top-3 hidden space-x-1 rounded-md font-mono text-[10px] text-sm font-medium md:flex ">
                <kbd>CTRL</kbd>
                <kbd>K</kbd>
              </div>
            </FormItem>
          )}
        />
        <FormDescription className="pt-2 text-xs text-muted-foreground">
          Press <kbd>ENTER</kbd> to add to the watchlist
        </FormDescription>
        {/* TODO: Add form error state */}
      </form>
    </Form>
  );
}