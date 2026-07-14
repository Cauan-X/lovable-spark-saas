import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, Loader2, Check } from "lucide-react";
import { PLANS } from "@/lib/site-data";

const searchSchema = z.object({
  plan: fallback(z.string(), "quarterly").default("quarterly"),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Checkout — Lovable Spark" }, { name: "description", content: "Finalize sua assinatura Lovable Spark com segurança." }] }),
  component: Checkout,
});

function Checkout() {
  const { plan } = Route.useSearch();
  const selected = PLANS.find((p) => p.id === plan) ?? PLANS[1];
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1600);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">Finalizar assinatura</h1>
      <p className="text-muted-foreground mt-2">Pagamento 100% seguro processado com criptografia.</p>

      <div className="grid gap-8 mt-8 lg:grid-cols-[1fr_380px]">
        <Card className="p-6">
          {done ? (
            <div className="text-center py-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Pagamento aprovado!</h2>
              <p className="text-muted-foreground mt-2">Sua licença já está ativa.</p>
              <Link to="/dashboard"><Button className="mt-6">Ir para o dashboard</Button></Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <h2 className="font-semibold text-lg flex items-center gap-2"><CreditCard className="h-5 w-5" /> Dados de pagamento</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label htmlFor="name">Nome completo</Label><Input id="name" required placeholder="João da Silva" /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required placeholder="voce@email.com" /></div>
                <div><Label htmlFor="cpf">CPF</Label><Input id="cpf" required placeholder="000.000.000-00" /></div>
                <div><Label htmlFor="card">Número do cartão</Label><Input id="card" required placeholder="0000 0000 0000 0000" /></div>
                <div><Label htmlFor="exp">Validade</Label><Input id="exp" required placeholder="MM/AA" /></div>
                <div><Label htmlFor="cvv">CVV</Label><Input id="cvv" required placeholder="123" /></div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</> : <>Finalizar compra <Lock className="ml-2 h-4 w-4" /></>}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Ao continuar você aceita os <Link to="/terms" className="underline">Termos</Link> e a <Link to="/privacy" className="underline">Privacidade</Link>.</p>
            </form>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold">Resumo do pedido</h3>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Plano {selected.name}</div>
                <div className="text-xs text-muted-foreground">{selected.period}</div>
              </div>
              <Badge>{selected.price}</Badge>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{selected.price}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>Impostos</span><span>Inclusos</span></div>
            <Separator className="my-4" />
            <div className="flex justify-between font-semibold"><span>Total</span><span>{selected.price}</span></div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Todos os planos</h3>
            <table className="w-full text-sm">
              <tbody>
                {PLANS.map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2 text-right font-medium">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}