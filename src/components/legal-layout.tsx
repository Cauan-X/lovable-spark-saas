import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground mt-2">Última atualização: {updated}</p>
      <Card className="mt-8 p-8">
        <article className="prose-legal space-y-4 text-sm leading-relaxed">
          {children}
        </article>
      </Card>
    </div>
  );
}