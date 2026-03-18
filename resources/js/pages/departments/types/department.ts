import { SimpleIdentifier } from "@/types";
import { MachineItem } from "./machine-item";
import { DepartmentMachineHistory } from "./department-machine-history";

export type Department = {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  department_machines_count: number | undefined | null;
  created_by: SimpleIdentifier;
  updated_by: SimpleIdentifier;
  created_at: string;
  updated_at: string;
  department_machines: { id: number; machine: MachineItem }[];
  histories: DepartmentMachineHistory[];
}