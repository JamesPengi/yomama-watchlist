import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { api } from "~/utils/api";

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

  const quickAdd = api.titles.quickAdd.useMutation({
    onSuccess(data) {
      // TODO: Invalidate query context
      console.log(data);
      form.reset();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    quickAdd.mutate(values.name);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full pt-10">
              <FormControl>
                <Input
                  type="name"
                  placeholder="Quick add title to watchlist"
                  className="rounded bg-gray-900 p-5 font-extrabold transition-colors focus:bg-gray-700"
                  {...field}
                />
              </FormControl>
              <FormDescription className="pt-2 text-xs font-light text-gray-400">
                Press enter to add the title to the watchlist
              </FormDescription>
            </FormItem>
          )}
        />
        {/* TODO: Add form error state */}
      </form>
    </Form>
  );
}
