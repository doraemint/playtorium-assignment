export interface DiscountCampaign {
  type: "fixed" | "percentage" | "category-percentage" | "points" | "seasonal";
  params: any;
}
