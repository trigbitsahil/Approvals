"use client";

import { useEffect, useState } from "react";
import { getProductByBarcode } from "@/api/services/productApi";

export default function Product({ barcode }: { barcode: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!barcode) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductByBarcode(barcode);
        console.log("API DATA:", data);
        setProduct(data);
      } catch (error) {
        console.log("API ERROR:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  if (!product)
    return (
      <p style={{ textAlign: "center", color: "red" }}>Product Not Found ❌</p>
    );

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <p>
        <b>Name:</b> {product.productName}
      </p>
      <p>
        <b>Barcode:</b> {product.barcode}
      </p>
      <p>
        <b>Price:</b> ₹ {product.price}
      </p>
    </div>
  );
}
