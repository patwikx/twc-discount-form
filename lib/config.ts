export interface Company {
  id: string;
  name: string;
  approverEmail: string;
}

export const COMPANIES: Company[] = [
  {
    id: "anchor-hotel",
    name: "Anchor Hotel",
    approverEmail: "plmiranda@rdrealty.com.ph", // Replace with real email later
  },
  {
    id: "dolores-tropicana",
    name: "Dolores Tropicana Resort",
    approverEmail: "manager@dolorestropicana.ph",
  },
  {
    id: "dolores-farm",
    name: "Dolores Farm Resort",
    approverEmail: "manager@doloresfarm.ph",
  },
  {
    id: "dolores-lake",
    name: "Dolores Lake Resort",
    approverEmail: "manager@doloreslake.ph",
  },
];

export const HOTELS = [
  "Dolores Hotel (Anchor)",
  "Dolores Tropicana Resort",
  "Dolores Farm Resort",
  "Dolores Lake Resort",
];

export const DISCOUNT_TYPES = [
  "Entrance Fee + 2 Children",
  "Cottage",
  "Room Accommodation",
  "Food & Beverage",
];
