import type {
  FAQCategory,
  FAQCategoryMeta,
  FAQItem,
  CustomerGuideTopic,
} from "@/types/faq";

/**
 * Metadata definitions for the 8 official Help Center disciplines.
 */
export const faqCategories: FAQCategoryMeta[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Orientation, store architectural purpose, and demonstration scope.",
    iconName: "Compass",
  },
  {
    id: "product-browsing",
    name: "Product Browsing",
    description: "Navigating the 30-specimen catalogue, categories, and brand labs.",
    iconName: "Grid",
  },
  {
    id: "search-filters",
    name: "Search & Filters",
    description: "Multi-parametric querying, price ranges, and laboratory sorting.",
    iconName: "Search",
  },
  {
    id: "product-comparison",
    name: "Product Comparison",
    description: "Side-by-side spec evaluation, difference highlighting, and limits.",
    iconName: "Scale",
  },
  {
    id: "3d-viewer",
    name: "Interactive 3D Viewer",
    description: "WebGL2 turntable controls, material variants, and procedural scenes.",
    iconName: "Box",
  },
  {
    id: "demo-offers",
    name: "Demo Offers",
    description: "Promotional tiers, founders packages, and bundle savings in INR.",
    iconName: "Tag",
  },
  {
    id: "contact-enquiry",
    name: "Contact & Enquiries",
    description: "Inquiry draft generation, mailto handoff, and privacy assurances.",
    iconName: "Mail",
  },
  {
    id: "about-nexora",
    name: "About NEXORA",
    description: "Engineering philosophy, design principles, and honest transparency.",
    iconName: "Info",
  },
];

/**
 * Centralized, authentic FAQ dataset.
 * Every answer strictly matches implemented frontend behavior with zero fabricated corporate claims.
 */
export const faqs: FAQItem[] = [
  // 1. Getting Started
  {
    id: "faq-gs-01",
    category: "getting-started",
    question: "What is NEXORA and what is the purpose of this website?",
    answer:
      "NEXORA is a high-fidelity fictional portfolio demonstration storefront for luxury electronics and spatial computing devices. It showcases modern frontend engineering, responsive design, accessible interactive UI components, WebGL 3D model rendering, and structured product comparison. It is not an operating commercial business.",
    keywords: ["what is nexora", "portfolio", "demo", "concept", "storefront", "purpose"],
    displayOrder: 1,
  },
  {
    id: "faq-gs-02",
    category: "getting-started",
    question: "Can I place real orders or make financial payments on NEXORA?",
    answer:
      "No. Real commercial transactions, payments, credit card processing, and checkout workflows are deliberately not implemented. All listed prices (in INR ₹) and discount badges are simulated demonstration values created for realistic user interface design.",
    keywords: ["buy", "order", "purchase", "payment", "checkout", "real", "fake", "money", "inr"],
    displayOrder: 2,
  },
  {
    id: "faq-gs-03",
    category: "getting-started",
    question: "Do you offer shipping, order tracking, or physical deliveries?",
    answer:
      "Because NEXORA is an interactive portfolio demonstration, physical logistics, parcel tracking, and global delivery services do not exist. We do not collect billing or delivery addresses, and no physical items will be shipped.",
    keywords: ["shipping", "delivery", "tracking", "courier", "logistics", "address"],
    displayOrder: 3,
  },

  // 2. Product Browsing
  {
    id: "faq-pb-01",
    category: "product-browsing",
    question: "How many hardware products are available in the catalogue?",
    answer:
      "The NEXORA catalogue features exactly 30 unique electronics specimens systematically organized into 6 hardware categories (5 products per category) and 6 partner engineering laboratories. Each product features rich technical specifications, verified high-resolution imagery, and variant configurations.",
    keywords: ["how many", "catalogue", "total products", "30", "specimens", "items"],
    displayOrder: 4,
  },
  {
    id: "faq-pb-02",
    category: "product-browsing",
    question: "What hardware divisions are represented across the storefront?",
    answer:
      "NEXORA organizes hardware into 6 dedicated engineering disciplines: Spatial Audio (planar magnetic & bone conduction acoustics), Neural Displays (high-PPI quantum OLED monitors), Wearable Tech (biometric rings & chronographs), Personal Computing (titanium laptops & neural workstations), Mobile Hardware (flagship smartphones), and Power & Precision (solid-state power hubs & interconnects).",
    keywords: ["categories", "divisions", "audio", "displays", "wearables", "laptops", "smartphones"],
    displayOrder: 5,
  },
  {
    id: "faq-pb-03",
    category: "product-browsing",
    question: "What are the 6 partner engineering laboratories?",
    answer:
      "The 30 specimens are created by 6 specialized conceptual laboratories: NEXORA Labs (flagship spatial systems), Aura Silicon (low-power neural processors), Chrono Rigs (liquid-cooled extreme compute), Zephyr Dynamics (aerospace carbon & titanium peripherals), Kvant Optical (studio micro-OLED & reference optics), and Vortex Acoustics (planar magnetic audiophile engineering).",
    keywords: ["brands", "laboratories", "partners", "manufacturers", "aura", "chrono", "zephyr", "kvant", "vortex"],
    displayOrder: 6,
  },

  // 3. Search and Filters
  {
    id: "faq-sf-01",
    category: "search-filters",
    question: "How does the catalogue search function work?",
    answer:
      "Catalogue search operates on the client side with immediate response. It matches your query terms against product names, brand titles, category disciplines, taglines, and technical specification tags. Searching is case-insensitive and trims extraneous whitespace automatically.",
    keywords: ["search", "query", "find", "filter", "instant", "client-side"],
    displayOrder: 7,
  },
  {
    id: "faq-sf-02",
    category: "search-filters",
    question: "Can I combine multiple filters simultaneously?",
    answer:
      "Yes. On the products catalogue page (`/products`), you can seamlessly combine text search with category filtering, partner brand isolation, and multi-criteria sorting (Price: Low to High, Price: High to Low, Name: A-Z, Name: Z-A, and Featured). All active criteria update the product grid reactively.",
    keywords: ["filters", "combine", "sort", "price range", "brand filter", "category filter"],
    displayOrder: 8,
  },
  {
    id: "faq-sf-03",
    category: "search-filters",
    question: "What happens if no products match my search query?",
    answer:
      "If no products match your active search terms or filter combinations, an accessible empty state card appears informing you of the zero-match result. You can click the 'Clear all filters' button to reset the view to all 30 catalogue specimens.",
    keywords: ["no results", "empty", "zero match", "reset", "clear"],
    displayOrder: 9,
  },

  // 4. Product Comparison
  {
    id: "faq-pc-01",
    category: "product-comparison",
    question: "How do I compare two or more products side by side?",
    answer:
      "Click the 'Compare' action button on any product card or product detail page. You can add between 2 and 4 products to your comparison tray. Once you have selected at least 2 compatible products, visit the comparison page (`/compare`) to review their full side-by-side specification matrix.",
    keywords: ["compare", "comparison", "matrix", "side by side", "tray"],
    displayOrder: 10,
  },
  {
    id: "faq-pc-02",
    category: "product-comparison",
    question: "Can I compare products from different categories?",
    answer:
      "To ensure meaningful, technically valid comparisons, products must share the same hardware category (e.g. comparing two smartphones or two audio devices). If you attempt to add a specimen from a different category, the system gracefully prompts you to clear the existing selection or compare within the active category.",
    keywords: ["category compatibility", "different category", "rules", "matrix"],
    displayOrder: 11,
  },
  {
    id: "faq-pc-03",
    category: "product-comparison",
    question: "What does the 'Show differences only' toggle do?",
    answer:
      "On the `/compare` page, toggling 'Show differences only' filters the comparison matrix so that rows with identical specifications across all compared products are hidden. Only parameters where values diverge are shown, helping you quickly identify architectural distinctions.",
    keywords: ["differences", "toggle", "highlight", "matrix filter"],
    displayOrder: 12,
  },

  // 5. Interactive 3D Viewer
  {
    id: "faq-3d-01",
    category: "3d-viewer",
    question: "Which products feature the interactive 3D WebGL viewer?",
    answer:
      "Currently, the NEXORA Nova 1 Pro (`/products/nexora-nova-1-pro`) and the Vortex Resonance Planar (`/products/vortex-resonance-planar`) feature interactive 3D viewers. These inspectable models use real glTF/GLB files licensed under Creative Commons 0 (CC0) and documented in our public asset attribution manifest.",
    keywords: ["3d", "webgl", "models", "nova 1 pro", "vortex planar", "glb", "gltf"],
    displayOrder: 13,
  },
  {
    id: "faq-3d-02",
    category: "3d-viewer",
    question: "How do I interact with the 3D model controls?",
    answer:
      "On supported 3D product pages, you can click and drag (or touch and drag on mobile) to orbit the turntable 360 degrees. Use your mouse scroll wheel or on-screen zoom buttons (+ / -) to inspect close-up surface metallurgy. You can also toggle auto-rotation, reset camera perspective, and switch material finishes dynamically.",
    keywords: ["controls", "orbit", "zoom", "rotate", "pan", "turntable", "touch"],
    displayOrder: 14,
  },
  {
    id: "faq-3d-03",
    category: "3d-viewer",
    question: "What happens on devices without WebGL2 or GPU acceleration?",
    answer:
      "The 3D viewer includes automatic WebGL capability detection. If your browser or device lacks WebGL support, or if hardware acceleration is unavailable, the component gracefully falls back to an accessible 2D high-resolution imagery gallery with full variant switching and zero layout breaks.",
    keywords: ["webgl fallback", "gpu", "compatibility", "low end", "fallback"],
    displayOrder: 15,
  },

  // 6. Demo Offers
  {
    id: "faq-do-01",
    category: "demo-offers",
    question: "What are the promotional offers shown on the `/offers` page?",
    answer:
      "The `/offers` section showcases 6 fictional promotional tiers (such as the Nova Flagship Founders Tier and Zephyr Creator Studio Pass). These packages demonstrate promotional UI design, countdown timers, mathematical bundle savings calculations in INR, and eligible hardware specimen listings.",
    keywords: ["offers", "promotions", "discounts", "founders tier", "deals", "bundles"],
    displayOrder: 16,
  },
  {
    id: "faq-do-02",
    category: "demo-offers",
    question: "Can I redeem or purchase any of the promotional bundles?",
    answer:
      "No. All discounts, bundle savings, and coupon codes shown on the offers page are illustrative demonstration concepts. No payment gateway or checkout mechanism is connected.",
    keywords: ["redeem", "coupon", "checkout offer", "buy deal"],
    displayOrder: 17,
  },

  // 7. Contact and Enquiries
  {
    id: "faq-ce-01",
    category: "contact-enquiry",
    question: "How does the Contact Us enquiry form work?",
    answer:
      "When you submit the form on `/contact`, the system validates all fields on the client side (name, email format, message length, and optional phone) and prepares a structured inquiry draft. It opens your operating system's default email client using a secure `mailto:` link populated with your subject and message. You must press 'Send' in your email client to dispatch the message.",
    keywords: ["contact", "enquiry", "form", "mailto", "email", "submit", "send"],
    displayOrder: 18,
  },
  {
    id: "faq-ce-02",
    category: "contact-enquiry",
    question: "Does NEXORA store my personal contact details in a database?",
    answer:
      "No. There is no remote backend database, telemetry logger, or third-party CRM attached to the contact form. All input values remain strictly inside your browser memory during the session and are never logged or sold.",
    keywords: ["privacy", "database", "storage", "personal data", "security"],
    displayOrder: 19,
  },
  {
    id: "faq-ce-03",
    category: "contact-enquiry",
    question: "What happens if no recipient email address is configured?",
    answer:
      "If the website administrator has not configured a public recipient address via environment variables (`NEXT_PUBLIC_CONTACT_EMAIL`), the form clearly discloses its demonstration mode and provides a convenient 'Copy Inquiry Draft' button so you can copy your formatted text to clipboard without error.",
    keywords: ["unconfigured", "missing recipient", "demo mode", "copy draft", "clipboard"],
    displayOrder: 20,
  },
  {
    id: "faq-ce-04",
    category: "contact-enquiry",
    question: "How does product enquiry prefill work?",
    answer:
      "When browsing any product detail page, clicking the 'Enquire About Specimen' button navigates you to `/contact?product=slug`. The contact form automatically detects the query parameter, verifies that the slug exists in our catalogue, pre-selects the product in the dropdown, and highlights the specimen card with its laboratory details.",
    keywords: ["product prefill", "slug", "enquire button", "active specimen"],
    displayOrder: 21,
  },

  // 8. About NEXORA
  {
    id: "faq-ab-01",
    category: "about-nexora",
    question: "What is the engineering philosophy behind NEXORA?",
    answer:
      "NEXORA is built on three core tenets: Monolithic Physicality (honest tactile aesthetics inspired by aerospace metallurgy and acoustic dampening), Spatial-First Architecture (utilizing interactive 3D WebGL rather than flat static thumbnails), and Demystified Silicon (clear technical specifications without marketing hyperbole).",
    keywords: ["philosophy", "monolithic", "spatial-first", "silicon", "values"],
    displayOrder: 22,
  },
  {
    id: "faq-ab-02",
    category: "about-nexora",
    question: "Are the awards, founding dates, or press mentions on the website real?",
    answer:
      "In accordance with our zero-fabrication charter, NEXORA does not invent fake corporate histories, founding years, venture capital funding, customer counts, or industry awards. All editorial content is presented candidly as an avant-garde design study and technical engineering showcase.",
    keywords: ["awards", "history", "founded", "real", "truth", "charter"],
    displayOrder: 23,
  },
];

/**
 * Structured Customer Guidance Topics matching actual implemented UI capabilities.
 */
export const customerGuides: CustomerGuideTopic[] = [
  {
    id: "guide-discovery",
    title: "Finding & Filtering Products",
    summary:
      "Explore the 30-specimen catalogue using real-time search, category switches, brand filters, and price ordering.",
    iconName: "Search",
    badge: "Catalogue Guide",
    steps: [
      {
        title: "Visit Catalogue Hub",
        description: "Navigate to `/products` to browse all 30 luxury electronics specimens simultaneously.",
        href: "/products",
        actionLabel: "Explore Catalogue",
      },
      {
        title: "Filter by Discipline",
        description: "Click any category badge (Spatial Audio, Neural Displays, etc.) to isolate specific hardware families.",
        href: "/categories",
        actionLabel: "View Categories",
      },
      {
        title: "Sort Parameters",
        description: "Use the sorting dropdown to organize specimens by price (ascending or descending) or alphabetically.",
      },
    ],
  },
  {
    id: "guide-3d-viewer",
    title: "Using the Interactive 3D Viewer",
    summary:
      "Inspect full 360-degree WebGL2 models with precision turntable rotation, zoom controls, and material finish switching.",
    iconName: "Box",
    badge: "Spatial Viewer",
    steps: [
      {
        title: "Select a 3D-Ready Specimen",
        description: "Open the NEXORA Nova 1 Pro or Vortex Resonance Planar product page to activate the WebGL canvas.",
        href: "/products/nexora-nova-1-pro",
        actionLabel: "Inspect Nova 1 Pro in 3D",
      },
      {
        title: "Orbit & Zoom",
        description: "Click and drag to rotate the specimen horizontally and vertically. Use mouse scroll or + / - buttons to zoom.",
      },
      {
        title: "Toggle Finishes & Perspective",
        description: "Select finish swatches to update metallic materials in real-time, or click 'Reset Camera' to return to center.",
      },
    ],
  },
  {
    id: "guide-comparison",
    title: "Comparing Hardware Specifications",
    summary:
      "Evaluate 2 to 4 devices side by side with category compatibility checks and difference-only matrix filtering.",
    iconName: "Scale",
    badge: "Comparison Matrix",
    steps: [
      {
        title: "Add Products to Tray",
        description: "Click 'Compare' on any product card. Add up to 4 specimens from the same hardware discipline.",
      },
      {
        title: "Open the Comparison Matrix",
        description: "Click 'View Comparison' or navigate to `/compare` to view the comprehensive side-by-side spec grid.",
        href: "/compare",
        actionLabel: "Go to Comparison",
      },
      {
        title: "Isolate Differences",
        description: "Enable the 'Show differences only' toggle to filter out identical parameters and highlight divergent specs.",
      },
    ],
  },
  {
    id: "guide-enquiry",
    title: "Submitting Technical Inquiries",
    summary:
      "Send structured hardware inquiries directly from product detail pages with automated specimen context and mailto handoff.",
    iconName: "Mail",
    badge: "Advisory Desk",
    steps: [
      {
        title: "Click Enquire on Product Page",
        description: "Select 'Enquire About Specimen' on any product page to route to `/contact` with your specimen pre-filled.",
      },
      {
        title: "Complete the Inquiry Form",
        description: "Provide your name, valid email, and your specific technical question (minimum 10 characters).",
        href: "/contact",
        actionLabel: "Visit Advisory Desk",
      },
      {
        title: "Dispatch via Email Client",
        description: "Click 'Prepare Inquiry Draft' to open your email application with the formatted inquiry ready to send.",
      },
    ],
  },
];

/**
 * Filter FAQs by text query and category.
 * Case-insensitive, whitespace-trimmed, searching across question, answer, keywords, and category name.
 */
export function searchFAQs(
  query: string,
  category: FAQCategory | "all" = "all"
): FAQItem[] {
  const cleanQuery = query.trim().toLowerCase();

  return faqs
    .filter((item) => {
      // Category filter check
      if (category !== "all" && item.category !== category) {
        return false;
      }

      // If query is empty, return all matching category
      if (!cleanQuery) {
        return true;
      }

      // Search across question
      if (item.question.toLowerCase().includes(cleanQuery)) {
        return true;
      }

      // Search across answer
      if (item.answer.toLowerCase().includes(cleanQuery)) {
        return true;
      }

      // Search across keywords
      if (item.keywords.some((kw) => kw.toLowerCase().includes(cleanQuery))) {
        return true;
      }

      // Search across category string
      if (item.category.toLowerCase().includes(cleanQuery)) {
        return true;
      }

      return false;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Retrieve FAQ item by unique ID.
 */
export function getFAQById(id: string): FAQItem | undefined {
  return faqs.find((item) => item.id === id);
}

/**
 * Retrieve all FAQs for a specific category.
 */
export function getFAQsByCategory(category: FAQCategory): FAQItem[] {
  return faqs
    .filter((item) => item.category === category)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
