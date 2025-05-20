import { DiscountCampaign } from "../models/discount-campaign";

export const mockDataCampaigns: DiscountCampaign[] = [
  { type: "fixed", params: { amount: 50 } },
  { type: "percentage", params: { percentage: 10 } },
  {
    type: "category-percentage",
    params: { percentage: 15, category: "Clothing" },
  },
  { type: "points", params: { points: 68 } },
  { type: "seasonal", params: { everyPrice: 300, discount: 40 } },
];
