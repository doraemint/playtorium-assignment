import { useState, useEffect } from "react";
import { DiscountCampaign } from "../models/discount-campaign";

export interface CartItem {
  id: number;
  price: number;
  category: string;
}

export function applyCoupon(total: number, campaign: DiscountCampaign): number {
  if (campaign.type === "fixed") {
    return total - campaign.params.amount;
  } else if (campaign.type === "percentage") {
    return total * (1 - campaign.params.percentage / 100);
  }
  return total;
}

export function applyCategoryDiscount(
  total: number,
  items: CartItem[],
  campaign: DiscountCampaign
): number {
  const category = campaign.params.category;
  const discountRate = campaign.params.percentage;

  const discountAmount = items
    .filter((item) => item.category === category)
    .reduce((sum, item) => sum + item.price * (discountRate / 100), 0);

  return total - discountAmount;
}

export function applyPointDiscount(
  total: number,
  campaign: DiscountCampaign
): number {
  const maxDiscount = total * 0.2;
  const points = campaign.params.points;
  const discount = Math.min(points, maxDiscount);
  return total - discount;
}

export function applySeasonalDiscount(
  total: number,
  campaign: DiscountCampaign
): number {
  const everyPrice = campaign.params.everyPrice;
  const discount = campaign.params.discount;

  const times = Math.floor(total / everyPrice);
  return total - times * discount;
}

export function useDiscount(
  cartItems: CartItem[],
  campaigns: DiscountCampaign[]
) {
  const [finalPrice, setFinalPrice] = useState<number>(0);

  useEffect(() => {
    let total = cartItems.reduce((sum, item) => sum + item.price, 0);

    const couponCampaign = campaigns.find(
      (c) => c.type === "fixed" || c.type === "percentage"
    );
    const categoryDiscount = campaigns.find(
      (c) => c.type === "category-percentage"
    );
    const pointDiscount = campaigns.find((c) => c.type === "points");
    const seasonalDiscount = campaigns.find((c) => c.type === "seasonal");

    if (couponCampaign) {
      total = applyCoupon(total, couponCampaign);
    }
    if (categoryDiscount) {
      total = applyCategoryDiscount(total, cartItems, categoryDiscount);
    }
    if (pointDiscount) {
      total = applyPointDiscount(total, pointDiscount);
    }
    if (seasonalDiscount) {
      total = applySeasonalDiscount(total, seasonalDiscount);
    }

    setFinalPrice(total);
  }, [cartItems, campaigns]);

  return finalPrice;
}
