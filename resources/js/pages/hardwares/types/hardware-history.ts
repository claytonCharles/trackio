import { SimpleIdentifier } from "@/types";

export type HardwareHistory = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  description: string;
  modified_at: string;
  category: SimpleIdentifier;
  status: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
  updated_by: SimpleIdentifier;
};