import type { Product } from "@/types";

export const MAX_COMPARISON_PRODUCTS = 4;
export const MIN_COMPARISON_PRODUCTS = 2;

export interface ComparisonSpecRow {
  key: string;
  label: string;
  group?: string;
  values: Record<string, string>; // productId -> value
  hasDifference: boolean;
}

export interface ComparisonSpecGroup {
  groupName: string;
  rows: ComparisonSpecRow[];
}

export interface ComparisonValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates whether a candidate product can be added to the active comparison list.
 * Rules:
 * 1. Must not already be in the list (duplicate prevention).
 * 2. Cannot exceed MAX_COMPARISON_PRODUCTS (maximum 4).
 * 3. Must match the categorySlug of currently selected products (category compatibility).
 */
export function validateComparisonAddition(
  current: Product[],
  candidate: Product
): ComparisonValidationResult {
  if (!candidate) {
    return { allowed: false, reason: "Invalid product candidate." };
  }

  // Prevent duplicates by stable id
  if (current.some((p) => p.id === candidate.id)) {
    return {
      allowed: false,
      reason: `"${candidate.name}" is already in your comparison selection.`,
    };
  }

  // Cap at 4
  if (current.length >= MAX_COMPARISON_PRODUCTS) {
    return {
      allowed: false,
      reason: `Comparison is limited to a maximum of ${MAX_COMPARISON_PRODUCTS} specimens. Remove a unit before adding another.`,
    };
  }

  // Strict category compatibility
  if (current.length > 0 && current[0].categorySlug.toLowerCase() !== candidate.categorySlug.toLowerCase()) {
    const activeCategory = current[0].category;
    return {
      allowed: false,
      reason: `Cannot compare a ${candidate.category} with ${activeCategory} hardware. Cross-category comparison is disabled to preserve technical specification relevance. Clear your selection or select another ${activeCategory} specimen.`,
    };
  }

  return { allowed: true };
}

/**
 * Normalizes specification names for case-insensitive and whitespace-safe matching.
 */
export function normalizeSpecKey(name: string): string {
  return name.trim().toLowerCase().replace(/[\s\-_]+/g, " ");
}

/**
 * Extracts a normalized value for a specific specification name from a product.
 * Returns "Not specified" if the attribute is absent (never returns "0" or omitted).
 */
export function getProductSpecValue(
  product: Product,
  specKey: string
): string {
  const normKey = normalizeSpecKey(specKey);
  const found = product.specifications?.find(
    (s) => normalizeSpecKey(s.name) === normKey
  );
  if (found && found.value && found.value.trim().length > 0) {
    return found.value.trim();
  }
  return "Not specified";
}

/**
 * Dynamically builds grouped comparison specification rows across compared products.
 */
export function buildComparisonMatrix(products: Product[]): ComparisonSpecGroup[] {
  if (products.length === 0) {
    return [];
  }

  const groups: ComparisonSpecGroup[] = [];

  // 1. General Overview & Commercial Group
  const generalRows: ComparisonSpecRow[] = [
    {
      key: "brand",
      label: "Artisan Laboratory",
      group: "Overview",
      values: Object.fromEntries(products.map((p) => [p.id, p.brand])),
      hasDifference: !products.every((p) => p.brand.toLowerCase() === products[0].brand.toLowerCase()),
    },
    {
      key: "category",
      label: "Engineering Division",
      group: "Overview",
      values: Object.fromEntries(products.map((p) => [p.id, p.category])),
      hasDifference: !products.every((p) => p.category.toLowerCase() === products[0].category.toLowerCase()),
    },
    {
      key: "price",
      label: "Illustrative Price (INR)",
      group: "Overview",
      values: Object.fromEntries(products.map((p) => [p.id, p.formattedPrice])),
      hasDifference: !products.every((p) => p.demoPrice === products[0].demoPrice),
    },
    {
      key: "studio3d",
      label: "3D Turntable Studio",
      group: "Overview",
      values: Object.fromEntries(
        products.map((p) => [p.id, p.has3DModel ? "Interactive 360° Studio" : "Photography Studio"])
      ),
      hasDifference: !products.every((p) => Boolean(p.has3DModel) === Boolean(products[0].has3DModel)),
    },
    {
      key: "variants",
      label: "Variant Finishes",
      group: "Overview",
      values: Object.fromEntries(
        products.map((p) => [
          p.id,
          p.variants && p.variants.length > 0
            ? `${p.variants.length} Configured Finish${p.variants.length > 1 ? "es" : ""}`
            : "Standard Production Specimen",
        ])
      ),
      hasDifference: !products.every(
        (p) => (p.variants?.length || 0) === (products[0].variants?.length || 0)
      ),
    },
  ];

  groups.push({
    groupName: "Catalogue Overview",
    rows: generalRows,
  });

  // 2. Technical Specifications Group (dynamically aggregated from product specifications)
  const specMap = new Map<string, { label: string; group: string }>();

  for (const product of products) {
    if (product.specifications) {
      for (const spec of product.specifications) {
        const norm = normalizeSpecKey(spec.name);
        if (!specMap.has(norm)) {
          specMap.set(norm, {
            label: spec.name.trim(),
            group: spec.group || "Technical Architecture",
          });
        }
      }
    }
  }

  // Partition technical specs by group
  const groupedTechSpecs = new Map<string, ComparisonSpecRow[]>();

  for (const [normKey, { label, group }] of specMap.entries()) {
    const values: Record<string, string> = {};
    const valList: string[] = [];

    for (const product of products) {
      const val = getProductSpecValue(product, normKey);
      values[product.id] = val;
      valList.push(val);
    }

    const first = valList[0].toLowerCase();
    const hasDifference = !valList.every((v) => v.toLowerCase() === first);

    const row: ComparisonSpecRow = {
      key: normKey,
      label,
      group,
      values,
      hasDifference,
    };

    const existingGroup = groupedTechSpecs.get(group) || [];
    existingGroup.push(row);
    groupedTechSpecs.set(group, existingGroup);
  }

  for (const [groupName, rows] of groupedTechSpecs.entries()) {
    groups.push({
      groupName,
      rows,
    });
  }

  return groups;
}

/**
 * Filters a comparison matrix to only include rows with differences.
 */
export function filterDifferencesOnly(groups: ComparisonSpecGroup[]): ComparisonSpecGroup[] {
  return groups
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) => row.hasDifference),
    }))
    .filter((group) => group.rows.length > 0);
}
