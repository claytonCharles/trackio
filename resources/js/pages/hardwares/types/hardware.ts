import { SimpleIdentifier } from "@/types";
import { HardwareMoveHistory } from "./hardware-move-history";
import { HardwareHistory } from "./hardware-history";

export type Hardware = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  description: string;
  category: SimpleIdentifier;
  status: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
  created_by: SimpleIdentifier;
  updated_by: SimpleIdentifier;
  created_at: string;
  updated_at: string;
  machine_hardware: {
    id: number,
    machine: SimpleIdentifier
  } | null;
  histories: HardwareHistory[];
  move_histories: HardwareMoveHistory[];
};