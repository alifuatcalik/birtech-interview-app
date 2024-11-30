import { Shelf } from "./shelf.interface";

export interface Market {
  id: string; // M1, M2, M3 gibi unique ID
  name: string; // Market A veya Market B
  shelves: Shelf[];
}