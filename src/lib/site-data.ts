export const PLANS = [
  {
    id: "monthly",
    name: "Mensal",
    price: "R$ 29,90",
    period: "/mês",
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
    price: "R$ 69,90",
    period: "/trimestre",
    highlight: true,
    features: [
      "Tudo do Mensal",
      "Economia de 22%",
      "Suporte prioritário",
      "2 dispositivos",
    ],
  },
  {
    id: "lifetime",
    name: "Vitalícia",
    price: "R$ 397",
    period: "pagamento único",
    highlight: false,
    features: [
      "Acesso vitalício",
      "Todas as futuras versões",
      "Suporte VIP",
      "5 dispositivos",
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