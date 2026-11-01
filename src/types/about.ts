export interface AboutCoreValue {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: "Compass" | "Eye" | "Accessibility" | "Sparkles" | "Sliders" | "ShieldCheck";
  pillLabel: string;
}

export interface AboutPhilosophyPillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  keyPoints: string[];
  accentColor: "electric" | "violet" | "cyan";
}

export interface AboutExperiencePrinciple {
  id: string;
  title: string;
  description: string;
  iconName: "Boxes" | "Scale" | "SlidersHorizontal" | "Headphones";
  practicalBenefit: string;
}

export interface AboutDemoFeature {
  id: string;
  title: string;
  badge: string;
  badgeVariant: "electric" | "violet" | "success" | "outline";
  description: string;
  implementationDetail: string;
  routeHref: string;
  routeLabel: string;
  isImplemented: boolean;
}

export interface AboutFutureVision {
  id: string;
  conceptTitle: string;
  category: string;
  horizon: string;
  description: string;
  architecturalGoal: string;
}

export interface AboutTrustPillar {
  id: string;
  title: string;
  description: string;
  iconName: "FileCheck2" | "Coins" | "Layers" | "MessageSquareCode";
  evidenceText: string;
}
