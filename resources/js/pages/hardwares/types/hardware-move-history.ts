import { SimpleIdentifier } from "@/types";

export type HardwareMoveHistory = {
  id: number;
  action: "attached" | "detached" | "moved";
  notes: string | null;
  modified_at: string;
  hardware: SimpleIdentifier;
  machine: SimpleIdentifier | null;
  previous_machine: SimpleIdentifier | null;
  created_by: SimpleIdentifier;
};