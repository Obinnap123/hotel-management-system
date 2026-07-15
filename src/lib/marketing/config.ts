export const marketingConfig = {
  companyName: "SymplyUp",
  productName: "SymplyUp Hotel Suite",
  demoUrl: process.env.NEXT_PUBLIC_DEMO_URL ?? "/demo",
  staffLoginUrl: process.env.NEXT_PUBLIC_STAFF_LOGIN_URL ?? "/login",
};

export const marketingNavLinks = [
  { href: "/features", label: "Features" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const marketingFooterGroups = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/solutions", label: "Solutions" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/request-demo", label: "Request Demo" },
    ],
  },
  {
    title: "Access",
    links: [{ href: marketingConfig.staffLoginUrl, label: "Staff Login" }],
  },
];
