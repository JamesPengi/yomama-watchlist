import { QuickAdd } from "./_components/QuickAdd";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="container mx-auto mt-10 space-y-10">
      <QuickAdd />
    </main>
  );
}
