import type { CategoryRow } from "@/components/admin/mock-data";
import type { BookableServiceRecord, CategoryFormData } from "./types";

export const FORM_ENTITY_OPTIONS = [
  { id: "category", label: "Subject Department" },
  { id: "service", label: "CBT Exam Paper" },
] as const;

export const VISIBILITY_OPTIONS = [
  { id: "active", label: "Active in Curriculum" },
  { id: "hidden", label: "Hidden / Draft" },
] as const;

export const SLA_OPTIONS = [
  { id: "Express 30m", label: "30m Timed CBT" },
  { id: "Same-Day", label: "60m Standard CBT" },
  { id: "Scheduled", label: "Term Exam Block" },
] as const;

export function buildInitialServices(
  categories: CategoryRow[]
): BookableServiceRecord[] {
  const list: BookableServiceRecord[] = [];
  categories.forEach((cat, cIdx) => {
    const subs =
      cat.subServices && cat.subServices.length > 0
        ? cat.subServices
        : [`${cat.title} Objective & Theory CBT`];
    subs.forEach((sub, sIdx) => {
      list.push({
        id: `srv_${cat.id}_${sIdx}`,
        title: sub,
        categoryId: cat.id,
        categoryTitle: cat.title,
        price: cat.basePrice + sIdx * 2500,
        duration: sIdx % 2 === 0 ? "45 - 60 mins" : "60 - 90 mins",
        dispatchSla:
          (cIdx + sIdx) % 3 === 0
            ? "Express 30m"
            : (cIdx + sIdx) % 2 === 0
              ? "Same-Day"
              : "Scheduled",
        status: cat.isActive ? "active" : "hidden",
      });
    });
  });
  return list;
}

export const DEFAULT_CATEGORY_FORM: CategoryFormData = {
  formMode: "category",
  editingId: null,
  title: "",
  description: "",
  basePrice: "15000",
  subServices: "Algebra & Number Base CBT, Geometry Drill, Past Questions Mock",
  categoryVisibility: "active",
  serviceTitle: "",
  serviceCategoryId: "",
  servicePrice: "18000",
  serviceDuration: "45 - 60 mins",
  serviceSla: "Express 30m",
  serviceStatus: "active",
};

