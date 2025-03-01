"use client";

import { Input } from "./ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { useEffect } from "react";
import { trpc } from "../_trpc/client";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/navigation";
import { SearchSuggestions } from "./ui/search-suggestions";
import { XIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter a title with at least two characters",
  }),
});

export function QuickAdd() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });
  const searchText = form.watch("name");

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
    onMutate(data) {
      toast({
        title: `Searching for the title '${data}'`,
        description: `Looking it up on TMDB...`,
      });
    },
    onSuccess(data) {
      toast({
        title: `Successfully added ${data?.titleName}`,
        description: `You can now do to the title's page by clicking on this button`,
        action: (
          <ToastAction
            altText="Go to page"
            onClick={() => {
              router.push(`/title/${data?.titleId}`);
            }}
          >
            Go to title
          </ToastAction>
        ),
      });
      queryContext.titles.invalidate();
      form.reset();
    },
    onError(error) {
      if (error.data?.code === "CONFLICT") {
        toast({
          title: `Uhh oh!`,
          description:
            "This title already exists in the watchlist! Please search for it instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Error: ${error.message}`,
          description: "Please try again later",
          variant: "destructive",
        });
      }
      queryContext.titles.invalidate();
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
        className="relative my-10 w-full flex-1"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="relative inline-flex w-full items-center rounded-md">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Quick add title to watchlist"
                  className="inline-flex rounded border-none bg-gray-900 px-5 py-8 font-extrabold transition-colors focus:bg-gray-800"
                  {...field}
                />
              </FormControl>
              <div className="hidden space-x-1 rounded-md font-mono text-sm text-[10px] font-medium md:flex">
                {searchText.length > 0 ? (
                  <div
                    onClick={() => form.reset()}
                    className="absolute top-4 right-2"
                  >
                    <XIcon className="text-muted-foreground h-8 w-8 hover:cursor-pointer" />
                  </div>
                ) : (
                  <div className="absolute top-5 right-2">
                    <kbd>CTRL</kbd>
                    <kbd>K</kbd>
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />
        <SearchSuggestions
          searchText={searchText}
          mutationFn={(name) => quickAdd.mutate(name)}
        />
      </form>
    </Form>
  );
}
