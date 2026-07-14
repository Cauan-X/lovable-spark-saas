import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Termos de Uso — Lovable Spark" }, { name: "description", content: "Termos e condições de uso do Lovable Spark." }] }),
  component: () => (
    <LegalLayout title="Termos de Uso" updated="10 de julho de 2026">
      <h2>1. Aceitação</h2>
      <p>Ao adquirir, instalar ou utilizar a extensão Lovable Spark, você concorda integralmente com estes Termos de Uso.</p>
      <h2>2. Objeto</h2>
      <p>A Lovable Spark é uma extensão para o navegador Google Chrome que adiciona ferramentas de produtividade à plataforma Lovable.dev. Não somos afiliados, endossados ou patrocinados pela Lovable Inc.</p>
      <h2>3. Licença</h2>
      <p>Concedemos ao usuário licença pessoal, não exclusiva e intransferível para utilização da extensão dentro dos limites do plano contratado.</p>
      <h2>4. Restrições</h2>
      <ul>
        <li>É proibida a engenharia reversa, redistribuição ou revenda.</li>
        <li>Uso em desacordo com os termos da Lovable.dev é de responsabilidade do usuário.</li>
      </ul>
      <h2>5. Pagamentos e renovação</h2>
      <p>Planos recorrentes são renovados automaticamente. O cancelamento pode ser feito a qualquer momento no Dashboard.</p>
      <h2>6. Limitação de responsabilidade</h2>
      <p>A Lovable Spark não se responsabiliza por perdas de dados, créditos ou projetos decorrentes do uso da extensão.</p>
      <h2>7. Foro</h2>
      <p>Fica eleito o foro da Comarca de São Paulo/SP para dirimir eventuais controvérsias.</p>
    </LegalLayout>
  ),
});