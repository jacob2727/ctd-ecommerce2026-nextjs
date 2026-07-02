"use client";
import axios from "axios";
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

  console.log(products);

  return (
    <div>
      <ul>{}</ul>
    </div>
  );
};

export default ProductCatalog;
