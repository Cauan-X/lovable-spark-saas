import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Lovable Spark" },
      { name: "description", content: "Como coletamos, usamos e protegemos seus dados." },
      { property: "og:url", content: "https://lovable-spark-saas.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://lovable-spark-saas.lovable.app/privacy" }],
  }),
  component: () => (
    <LegalLayout title="Política de Privacidade" updated="10 de julho de 2026">
      <h2>1. Introdução</h2>
      <p>A Lovable Spark ("nós", "nosso") respeita sua privacidade e está comprometida em proteger os dados pessoais que você compartilha conosco, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).</p>
      <h2>2. Dados que coletamos</h2>
      <ul>
        <li>Nome completo e email fornecidos no cadastro.</li>
        <li>CPF e dados de pagamento para emissão de nota fiscal.</li>
        <li>Endereço IP e dados de uso da extensão (anônimos).</li>
      </ul>
      <h2>3. Uso dos dados</h2>
      <p>Utilizamos seus dados exclusivamente para operar a plataforma, processar pagamentos, emitir notas fiscais e enviar comunicações relevantes sobre atualizações e suporte.</p>
      <h2>4. Compartilhamento</h2>
      <p>Não vendemos nem alugamos seus dados. Compartilhamos apenas com processadores de pagamento (Stripe, Mercado Pago) e provedores de infraestrutura sob contrato de confidencialidade.</p>
      <h2>5. Seus direitos</h2>
      <p>Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados a qualquer momento pelo email <strong>privacidade@lovablespark.com.br</strong>.</p>
      <h2>6. Segurança</h2>
      <p>Empregamos criptografia TLS 1.3, senhas com hash bcrypt e auditoria periódica dos sistemas.</p>
      <h2>7. Cookies</h2>
      <p>Consulte nossa <a href="/cookies">Política de Cookies</a> para detalhes.</p>
      <h2>8. Contato do encarregado</h2>
      <p>DPO: privacidade@lovablespark.com.br</p>
    </LegalLayout>
  ),
});