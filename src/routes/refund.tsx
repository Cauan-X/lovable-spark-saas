import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Política de Reembolso — Lovable Spark" }, { name: "description", content: "Regras e prazos para reembolso." }] }),
  component: () => (
    <LegalLayout title="Política de Reembolso" updated="10 de julho de 2026">
      <h2>1. Garantia de 7 dias</h2>
      <p>Em conformidade com o Código de Defesa do Consumidor (art. 49), oferecemos reembolso integral em até 7 dias corridos após a compra, sem necessidade de justificativa.</p>
      <h2>2. Como solicitar</h2>
      <ol>
        <li>Envie um email para <strong>reembolso@lovablespark.com.br</strong> com o assunto "Reembolso".</li>
        <li>Inclua o email da compra e o número do pedido.</li>
        <li>Processaremos o estorno em até 5 dias úteis.</li>
      </ol>
      <h2>3. Após o prazo</h2>
      <p>Solicitações após 7 dias são avaliadas caso a caso e podem ser recusadas.</p>
      <h2>4. Plano vitalício</h2>
      <p>O plano vitalício segue a mesma garantia de 7 dias. Após esse período, não há reembolso proporcional.</p>
      <h2>5. Assinaturas canceladas</h2>
      <p>O cancelamento interrompe cobranças futuras, sem devolução de valores já pagos.</p>
    </LegalLayout>
  ),
});