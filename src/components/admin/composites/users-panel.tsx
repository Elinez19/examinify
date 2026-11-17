/**
 * School Users, Teachers & Admin Management Composite Workspace
 * Separates concerns across:
 * - Domain Types: "@/components/admin/users/types"
 * - Constants: "@/components/admin/users/constants"
 * - Custom Hooks: "@/hooks/admin"
 * - Modular UI: "@/components/admin/users/*"
 */

export * from "@/components/admin/users/types";
export * from "@/components/admin/users/constants";
export * from "@/components/admin/users/users-kpi-summary";
export * from "@/components/admin/users/user-management-form";
export * from "@/components/admin/users/teachers-table";
export * from "@/components/admin/users/students-table";
export * from "@/components/admin/users/admins-table";
export * from "@/components/admin/users/users-directory";
export * from "@/components/admin/users/staff-directory";
export * from "@/components/admin/users/students-directory";
export * from "@/components/admin/users/teachers-directory";
export * from "@/components/admin/users/assign-staff-role-view";
