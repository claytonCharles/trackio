import { SimpleIdentifier } from "@/types";

export type MachineItem = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  category: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
  status: SimpleIdentifier;
};