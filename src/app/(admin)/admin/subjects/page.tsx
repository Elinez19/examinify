import { CategoriesTaxonomyWorkspace } from "@/components/admin/composites/subjects-workspace";
import { MOCK_CATEGORIES } from "@/components/admin/mock-data";

export default function AdminCategoriesPage() {
  return <CategoriesTaxonomyWorkspace initialCategories={MOCK_CATEGORIES} />;
}
