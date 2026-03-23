import { SimpleIdentifier } from "@/types";

export type HardwareAvailable = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  category_id: number;
  manufacturer_id: number;
  category: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
}