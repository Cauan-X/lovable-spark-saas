import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/cookies")({
  head: () => ({ meta: [{ title: "Política de Cookies — Lovable Spark" }, { name: "description", content: "Como usamos cookies em nosso site e extensão." }] }),
  component: () => (
    <LegalLayout title="Política de Cookies" updated="10 de julho de 2026">
      <h2>1. O que são cookies</h2>
      <p>Cookies são pequenos arquivos armazenados no seu navegador para melhorar a experiência de uso e coletar dados de navegação.</p>
      <h2>2. Tipos de cookies que utilizamos</h2>
      <ul>
        <li><strong>Essenciais:</strong> mantêm você autenticado no Dashboard.</li>
        <li><strong>Analíticos:</strong> ajudam a medir uso agregado (Plausible Analytics).</li>
        <li><strong>Marketing:</strong> apenas com seu consentimento explícito.</li>
      </ul>
      <h2>3. Como gerenciar</h2>
      <p>Você pode desativar cookies nas configurações do seu navegador. Note que isso pode impactar funcionalidades como login persistente.</p>
      <h2>4. Cookies de terceiros</h2>
      <p>Utilizamos serviços de processamento de pagamento e analytics que podem definir seus próprios cookies. Consulte as políticas desses parceiros.</p>
      <h2>5. Consentimento</h2>
      <p>Ao continuar navegando você concorda com o uso descrito nesta política.</p>
    </LegalLayout>
  ),
});