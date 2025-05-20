"use client";

import { dataList } from "@/shared/data/mock-list-shopping";
import { ItemShop } from "@/shared/models/item-shop-model";
import { useEffect, useState } from "react";
import Card from "@/shared/components/card";
import Image from "next/image";
import { mockDataCampaigns } from "@/shared/data/mock-campaigns";
import {
  applyCoupon,
  applyCategoryDiscount,
  applyPointDiscount,
  applySeasonalDiscount,
} from "@/shared/hooks/use-discount";

export default function Home() {
  const [addItemToCart, setAddItemToCart] = useState<ItemShop[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCouponType, setSelectedCouponType] = useState<
    "fixed" | "percentage" | null
  >(null);
  const [discountBreakdown, setDiscountBreakdown] = useState<string[]>([]);

  const [finalPrice, setFinalPrice] = useState<number>(0);
  const campaigns = mockDataCampaigns;

  const fixedCoupon = mockDataCampaigns.find((c) => c.type === "fixed");
  const percentageCoupon = mockDataCampaigns.find(
    (c) => c.type === "percentage"
  );

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    const total = addItemToCart.reduce((sum, item) => sum + item.price, 0);
    let tempTotal = total;
    const breakdown: string[] = [];

    if (selectedCouponType) {
      const couponCampaign = campaigns.find(
        (c) => c.type === selectedCouponType
      );
      if (couponCampaign) {
        const before = tempTotal;
        tempTotal = applyCoupon(tempTotal, couponCampaign);
        breakdown.push(
          `${
            selectedCouponType.charAt(0).toUpperCase() +
            selectedCouponType.slice(1)
          } discount: -$${(before - tempTotal).toFixed(2)}`
        );
      }
    }

    const categoryDiscount = campaigns.find(
      (c) => c.type === "category-percentage"
    );
    if (categoryDiscount) {
      const before = tempTotal;
      tempTotal = applyCategoryDiscount(
        tempTotal,
        addItemToCart,
        categoryDiscount
      );
      breakdown.push(`Category discount: -$${(before - tempTotal).toFixed(2)}`);
    }

    const pointDiscount = campaigns.find((c) => c.type === "points");
    if (pointDiscount) {
      const before = tempTotal;
      tempTotal = applyPointDiscount(tempTotal, pointDiscount);
      breakdown.push(`Points used: -$${(before - tempTotal).toFixed(2)}`);
    }

    const seasonalDiscount = campaigns.find((c) => c.type === "seasonal");
    if (seasonalDiscount) {
      const before = tempTotal;
      tempTotal = applySeasonalDiscount(tempTotal, seasonalDiscount);
      breakdown.push(`Seasonal discount: -$${(before - tempTotal).toFixed(2)}`);
    }

    setDiscountBreakdown(breakdown);
    setFinalPrice(Math.max(0, tempTotal));
  }, [addItemToCart, campaigns, selectedCouponType]);

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-end py-2 pl-4">
        <button onClick={handleOpenModal}>
          <Image src="/icons/cart.png" alt="cart icon" width="30" height="30" />
        </button>
      </nav>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dataList.map((item) => (
          <Card
            key={item.id}
            img={item.img}
            title={item.title}
            detail={item.detail}
            price={item.price}
            category={
              item.category as "Clothing" | "Accessories" | "Electronics"
            }
            onAddToCart={() =>
              setAddItemToCart([...addItemToCart, item as ItemShop])
            }
          />
        ))}
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Your Cart</h2>
            {addItemToCart.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              <div>
                <ul className="space-y-2">
                  {addItemToCart.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.title}</span>
                      <span>${item.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <p className="font-bold mb-2">Choose discount type:</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedCouponType("fixed")}
                      className={`px-4 py-2 border rounded ${
                        selectedCouponType === "fixed"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {fixedCoupon
                        ? `Fixed $${fixedCoupon.params.amount} Off`
                        : "Fixed discount"}
                    </button>
                    <button
                      onClick={() => setSelectedCouponType("percentage")}
                      className={`px-4 py-2 border rounded ${
                        selectedCouponType === "percentage"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {percentageCoupon
                        ? `${percentageCoupon.params.percentage}% Off`
                        : "Percentage discount"}
                    </button>
                  </div>
                </div>

                {discountBreakdown.length > 0 && (
                  <div className="mt-4 text-sm text-red-700 space-y-1">
                    <p className="font-bold">Discount applied:</p>
                    {discountBreakdown.map((item, index) => (
                      <p key={index}>• {item}</p>
                    ))}
                  </div>
                )}

                <div className="mt-4 font-bold">
                  <p>Total after discount:</p>
                  <p>${finalPrice.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
