import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageCircle, Send, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { contactSchema } from "@/lib/validation";
import { submitContact } from "@/lib/contact.functions";
import { prettyError } from "@/lib/error-messages";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contato — Lovable Spark" }, { name: "description", content: "Fale com nosso suporte via Telegram, WhatsApp, email ou formulário." }] }),
  component: Contact,
});

const FAQ = [
  { q: "Quanto tempo leva para receber a licença?", a: "Instantaneamente após a confirmação do pagamento." },
  { q: "Posso usar em mais de um computador?", a: "Sim, respeitando o limite de dispositivos do seu plano." },
  { q: "Como funciona o reembolso?", a: "Oferecemos garantia de 7 dias. Veja a página de reembolso para detalhes." },
  { q: "A extensão fica ativa após o vencimento?", a: "Não. As ferramentas param de funcionar até renovação." },
];

function Contact() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = useServerFn(submitContact);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const parsed = contactSchema.safeParse({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await submit({ data: parsed.data });
      setSent(true);
    } catch (err) {
      toast.error(prettyError(err, "Não foi possível enviar. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Fale com a gente</h1>
      <p className="text-muted-foreground mt-2">Respondemos em até 2 horas úteis.</p>

      <div className="grid gap-8 mt-8 lg:grid-cols-[1fr_360px]">
        <Card className="p-6">
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary mb-4"><Check className="h-5 w-5" /></div>
              <h2 className="text-xl font-semibold">Mensagem enviada!</h2>
              <p className="text-muted-foreground mt-2">Entraremos em contato em breve.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Honeypot antibot: escondido de humanos, visível para bots */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden" style={{ position: "absolute", left: "-9999px" }}>
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="n">Nome</Label>
                  <Input id="n" name="name" maxLength={100} required />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="e">Email</Label>
                  <Input id="e" name="email" type="email" maxLength={254} required />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="s">Assunto</Label>
                <Input id="s" name="subject" maxLength={150} required />
                {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
              </div>
              <div>
                <Label htmlFor="m">Mensagem</Label>
                <Textarea id="m" name="message" rows={6} maxLength={2000} required />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={loading}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando</> : <>Enviar <Send className="ml-2 h-4 w-4" /></>}</Button>
            </form>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Canais diretos</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-primary" /> Telegram: @lovablespark</li>
              <li className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-primary" /> WhatsApp: (11) 91234-5678</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> suporte@lovablespark.com.br</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Perguntas frequentes</h3>
            <Accordion type="single" collapsible>
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`i${i}`}>
                  <AccordionTrigger className="text-sm text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
}