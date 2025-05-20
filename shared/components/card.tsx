import Image from "next/image";

type CardProps = {
  img: string;
  title: string;
  detail: string;
  price: number;
  category: "Clothing" | "Accessories" | "Electronics";
  onAddToCart: () => void;
};

const Card = ({ img, title, detail, price, onAddToCart }: CardProps) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <Image
        src={img}
        alt={title}
        width={250}
        height={300}
        className="rounded-t-lg w-full"
      />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {detail}
        </p>
        <p className="mb-3 font-semibold text-lg text-gray-900 dark:text-white">
          ฿{price}
        </p>
        <button
          onClick={onAddToCart}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Card;
