import { SimpleIdentifier } from "@/types";

export type DepartmentMachineHistory = {
  id: number;
  action: "attached" | "detached" | "moved";
  modified_at: string;
  machine: SimpleIdentifier;
  previous_department: SimpleIdentifier | null;
  created_by: SimpleIdentifier;
};