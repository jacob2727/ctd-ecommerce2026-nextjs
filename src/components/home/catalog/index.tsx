"use client";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/all`,
      );
      setProducts(productsRes.data);
    };
    fetchProducts();
  }, []);

  const router = useRouter();

  return (
    <div>
      <ul className="grid grid-cols-5 gap-15 p-15">
        {products.map((product: any, index: number) => (
          <li
            key={index}
            onClick={() => router.push(`/product/${product.id}`)}
            className="col-span-1 shadow hover:cursor-pointer p-5 rounded-2xl flex flex-col gap-5 items-center hover:shadow-2xl hover:border-purple-600 hover:border border-0 transition-all duration-300"
          >
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p>Retailer: {product.owner.name}</p>
            <p>${(product.priceInCents / 100).toFixed(2)}</p>
            <p>{product.discounted && <Badge>Discounted</Badge>}</p>
            {product.discounted && (
              <p>Original Price: {(product.ogPriceInCents / 100).toFixed(2)}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCatalog;
