export const PLANS = [
  {
    id: "test",
    name: "Teste R$1",
    price: "R$ 1",
    period: "",
    checkoutUrl: "https://pay.cakto.com.br/torisxp_984190",
    highlight: false,
    features: [
      "Produto de teste",
      "Fluxo completo de compra",
    ],
  },
  {
    id: "monthly",
    name: "Mensal",
    price: "R$ 29",
    period: "/mês",
    checkoutUrl: "https://pay.cakto.com.br/3282ng5_973347",
    highlight: false,
    features: [
      "Todas as ferramentas Spark",
      "Atualizações mensais",
      "Suporte no Telegram",
      "1 dispositivo",
    ],
  },
  {
    id: "quarterly",
    name: "Trimestral",
    price: "R$ 69",
    period: "/trimestre",
    checkoutUrl: "https://pay.cakto.com.br/brgjmic_973369",
    highlight: true,
    features: [
      "Tudo do Mensal",
      "Economia de 22%",
      "Suporte prioritário",
      "2 dispositivos",
    ],
  },
  {
    id: "annual",
    name: "Anual",
    price: "R$ 197",
    period: "/ano",
    checkoutUrl: "https://pay.cakto.com.br/kc6kjzk_973382",
    highlight: false,
    features: [
      "Tudo do Trimestral",
      "Economia de 43%",
      "Suporte VIP",
      "3 dispositivos",
    ],
  },
] as const;

export const NAV_LINKS = [
  { to: "/", label: "Início" },
  { to: "/docs", label: "Docs" },
  { to: "/changelog", label: "Changelog" },
  { to: "/contact", label: "Contato" },
  { to: "/dashboard", label: "Dashboard" },
] as const;