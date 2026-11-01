import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hardware Specification Matrix",
  description:
    "Interactive side-by-side parametric hardware evaluation and technical specification comparison for NEXORA specimens.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
