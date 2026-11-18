"use client";

import * as React from "react";

export interface TableSelectionState {
  selectedIds: string[];
  selectedCount: number;
  allSelected: boolean;
  someSelected: boolean;
  isSelected: (id: string) => boolean;
  toggleOne: (id: string) => void;
  toggleAll: (checked?: boolean) => void;
  clearSelection: () => void;
}

/**
 * Shared row-selection state helper for AdminDataTable checkboxes.
 */
export function useTableSelection(
  visibleIds: ReadonlyArray<string>
): TableSelectionState {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const selectedSet = React.useMemo(
    () => new Set(selectedIds),
    [selectedIds]
  );

  const visibleSelectedCount = React.useMemo(
    () => visibleIds.filter((id) => selectedSet.has(id)).length,
    [selectedSet, visibleIds]
  );

  const allSelected =
    visibleIds.length > 0 && visibleSelectedCount === visibleIds.length;
  const someSelected = visibleSelectedCount > 0 && !allSelected;

  const isSelected = React.useCallback(
    (id: string) => selectedSet.has(id),
    [selectedSet]
  );

  const toggleOne = React.useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleAll = React.useCallback(
    (checked?: boolean) => {
      const shouldSelect = checked !== undefined ? checked : !allSelected;
      if (!shouldSelect) {
        const visibleSet = new Set(visibleIds);
        setSelectedIds((prev) => prev.filter((id) => !visibleSet.has(id)));
        return;
      }
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...visibleIds]))
      );
    },
    [allSelected, visibleIds]
  );

  const clearSelection = React.useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    allSelected,
    someSelected,
    isSelected,
    toggleOne,
    toggleAll,
    clearSelection,
  };
}
