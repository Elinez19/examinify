"use client";

import { useCallback, useState } from "react";
import type { CategoryRow } from "@/components/admin/mock-data";
import { buildInitialServices } from "@/components/admin/subjects/constants";
import type {
  BookableServiceRecord,
  CategoryFormData,
} from "@/components/admin/subjects/types";

export interface UseCategoriesTaxonomyReturn {
  items: CategoryRow[];
  setItems: React.Dispatch<React.SetStateAction<CategoryRow[]>>;
  services: BookableServiceRecord[];
  setServices: React.Dispatch<React.SetStateAction<BookableServiceRecord[]>>;
  saving: boolean;
  savedBanner: string | null;
  notifySaved: (msg: string) => void;
  saveCategoryOrService: (formData: CategoryFormData) => Promise<boolean>;
  toggleCategoryActive: (cat: CategoryRow) => Promise<void>;
  deleteCategory: (id: string, onDeleted?: () => void) => Promise<void>;
  toggleServiceStatus: (id: string) => void;
  deleteService: (id: string, onDeleted?: () => void) => void;
  batchToggleCategoryActive: (ids: string[], nextActive: boolean) => void;
  batchDeleteCategories: (ids: string[]) => void;
  batchDeleteServices: (ids: string[]) => void;
}

export function useCategoriesTaxonomy(
  initialCategories: CategoryRow[]
): UseCategoriesTaxonomyReturn {
  const [items, setItems] = useState<CategoryRow[]>(initialCategories);
  const [services, setServices] = useState<BookableServiceRecord[]>(() =>
    buildInitialServices(initialCategories)
  );
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const notifySaved = useCallback((msg: string) => {
    setSavedBanner(msg);
    setTimeout(() => setSavedBanner(null), 3500);
  }, []);

  const saveCategoryOrService = useCallback(
    async (formData: CategoryFormData): Promise<boolean> => {
      setSaving(true);
      try {
        if (formData.formMode === "category") {
          const parsedSubs = formData.subServices
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          const isActive = formData.categoryVisibility === "active";

          if (formData.editingId) {
            setItems((prev) =>
              prev.map((c) =>
                c.id === formData.editingId
                  ? {
                      ...c,
                      title: formData.title,
                      description: formData.description,
                      basePrice: Number(formData.basePrice),
                      subServices: parsedSubs,
                      isActive,
                      updatedAt: new Date(),
                    }
                  : c
              )
            );
            notifySaved(`Updated subject "${formData.title}"`);
            return true;
          }

          const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          const newCategory: CategoryRow = {
            id: `cat_${Date.now()}`,
            title: formData.title,
            slug,
            iconName: "book-open-variant",
            iconFamily: "MaterialCommunityIcons",
            description: formData.description,
            subServices: parsedSubs,
            basePrice: Number(formData.basePrice),
            isPopular: true,
            isActive,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setItems((prev) => [...prev, newCategory]);
          const newServices: BookableServiceRecord[] = parsedSubs.map(
            (sub, idx) => ({
              id: `srv_${newCategory.id}_${idx}_${Date.now()}`,
              title: sub,
              categoryId: newCategory.id,
              categoryTitle: newCategory.title,
              price: Number(formData.basePrice) + idx * 2500,
              duration: "45 - 60 mins",
              dispatchSla: "Same-Day",
              status: isActive ? "active" : "hidden",
            })
          );
          setServices((prev) => [...newServices, ...prev]);
          notifySaved(`Created subject "${formData.title}"`);
          return true;
        }

        const parentCat =
          items.find((c) => c.id === formData.serviceCategoryId) || items[0];
        const categoryTitle = parentCat
          ? parentCat.title
          : "General Subject";
        const resolvedCatId = parentCat ? parentCat.id : "general";

        if (formData.editingId) {
          setServices((prev) =>
            prev.map((srv) =>
              srv.id === formData.editingId
                ? {
                    ...srv,
                    title: formData.serviceTitle,
                    categoryId: resolvedCatId,
                    categoryTitle,
                    price: Number(formData.servicePrice) || 15000,
                    duration: formData.serviceDuration,
                    dispatchSla: formData.serviceSla,
                    status: formData.serviceStatus,
                  }
                : srv
            )
          );
          notifySaved(`Updated CBT paper "${formData.serviceTitle}"`);
          return true;
        }

        const newSrv: BookableServiceRecord = {
          id: `srv_${Date.now()}`,
          title: formData.serviceTitle,
          categoryId: resolvedCatId,
          categoryTitle,
          price: Number(formData.servicePrice) || 15000,
          duration: formData.serviceDuration,
          dispatchSla: formData.serviceSla,
          status: formData.serviceStatus,
        };
        setServices((prev) => [newSrv, ...prev]);

        if (parentCat) {
          const updatedSubs = Array.from(
            new Set([
              ...(parentCat.subServices || []),
              formData.serviceTitle,
            ])
          );
          setItems((prev) =>
            prev.map((c) =>
              c.id === parentCat.id
                ? { ...c, subServices: updatedSubs, updatedAt: new Date() }
                : c
            )
          );
        }
        notifySaved(`Added CBT paper "${formData.serviceTitle}"`);
        return true;
      } finally {
        setSaving(false);
      }
    },
    [items, notifySaved]
  );

  const toggleCategoryActive = useCallback(
    async (cat: CategoryRow) => {
      const nextActive = !cat.isActive;
      setItems((prev) =>
        prev.map((c) =>
          c.id === cat.id
            ? { ...c, isActive: nextActive, updatedAt: new Date() }
            : c
        )
      );
      notifySaved(`${cat.title} marked ${nextActive ? "Active" : "Hidden"}`);
    },
    [notifySaved]
  );

  const deleteCategory = useCallback(
    async (id: string, onDeleted?: () => void) => {
      setItems((prev) => prev.filter((c) => c.id !== id));
      setServices((prev) => prev.filter((s) => s.categoryId !== id));
      onDeleted?.();
      notifySaved("Subject removed from curriculum");
    },
    [notifySaved]
  );

  const toggleServiceStatus = useCallback(
    (id: string) => {
      setServices((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: s.status === "active" ? "hidden" : "active" }
            : s
        )
      );
      notifySaved("CBT paper visibility updated");
    },
    [notifySaved]
  );

  const deleteService = useCallback(
    (id: string, onDeleted?: () => void) => {
      setServices((prev) => prev.filter((s) => s.id !== id));
      onDeleted?.();
      notifySaved("CBT paper removed");
    },
    [notifySaved]
  );

  const batchToggleCategoryActive = useCallback(
    (ids: string[], nextActive: boolean) => {
      setItems((prev) =>
        prev.map((c) => (ids.includes(c.id) ? { ...c, isActive: nextActive } : c))
      );
      notifySaved(
        `Marked ${ids.length} subject(s) ${nextActive ? "active" : "hidden"}`
      );
    },
    [notifySaved]
  );

  const batchDeleteCategories = useCallback(
    (ids: string[]) => {
      const count = ids.length;
      setItems((prev) => prev.filter((c) => !ids.includes(c.id)));
      setServices((prev) => prev.filter((s) => !ids.includes(s.categoryId)));
      notifySaved(`Removed ${count} subject(s)`);
    },
    [notifySaved]
  );

  const batchDeleteServices = useCallback(
    (ids: string[]) => {
      const count = ids.length;
      setServices((prev) => prev.filter((s) => !ids.includes(s.id)));
      notifySaved(`Removed ${count} CBT paper(s)`);
    },
    [notifySaved]
  );

  return {
    items,
    setItems,
    services,
    setServices,
    saving,
    savedBanner,
    notifySaved,
    saveCategoryOrService,
    toggleCategoryActive,
    deleteCategory,
    toggleServiceStatus,
    deleteService,
    batchToggleCategoryActive,
    batchDeleteCategories,
    batchDeleteServices,
  };
}
