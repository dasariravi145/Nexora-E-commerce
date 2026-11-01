export interface NavItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
  external?: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  navItems: NavItem[];
  footerNav: {
    shop: NavItem[];
    experience: NavItem[];
    company: NavItem[];
    support: NavItem[];
  };
  links: {
    github?: string;
    twitter?: string;
    discord?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "NEXORA",
  tagline: "Next-Generation Electronics & Spatial Computing",
  description:
    "An original, premium electronics retail destination engineered with precision acoustics, cutting-edge spatial displays, and next-generation personal computing hardware.",
  url: "https://nexora.store",
  ogImage: "/images/og-nexora.png",
  navItems: [
    { title: "Home", href: "/" },
    { title: "Products", href: "/products", badge: "3D Ready" },
    { title: "Categories", href: "/categories" },
    { title: "Brands", href: "/brands" },
    { title: "Offers", href: "/offers", badge: "Exclusive" },
    { title: "About", href: "/about" },
    { title: "Help", href: "/help" },
    { title: "Contact", href: "/contact" },
  ],
  footerNav: {
    shop: [
      { title: "All Products", href: "/products" },
      { title: "Spatial Audio", href: "/categories" },
      { title: "Neural Displays", href: "/categories" },
      { title: "Wearable Tech", href: "/categories" },
      { title: "Exclusive Offers", href: "/offers" },
    ],
    experience: [
      { title: "3D Hardware Viewer", href: "/products" },
      { title: "Hardware Comparison", href: "/compare" },
      { title: "Brand Showcases", href: "/brands" },
      { title: "Demo Cart", href: "/cart" },
      { title: "Interactive Configurator", href: "/products" },
    ],
    company: [
      { title: "About NEXORA", href: "/about" },
      { title: "Engineering Philosophy", href: "/about" },
      { title: "Sustainability", href: "/about" },
      { title: "Press & News", href: "/about" },
    ],
    support: [
      { title: "Help Center", href: "/help" },
      { title: "Frequently Asked Questions", href: "/faq" },
      { title: "Customer Guidance", href: "/help#customer-guidance" },
      { title: "Contact Advisory Desk", href: "/contact" },
    ],
  },
  links: {
    twitter: "https://twitter.com/nexora_tech",
    github: "https://github.com/nexora-store",
  },
};
