"use client";

import { useEffect, useState } from "react";
import { getAllProducts, Product } from "@/api/services/productApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg font-semibold">Loading...</p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <h2 className="text-3xl font-bold text-center">All Products</h2>

      {products.length === 0 && (
        <p className="text-center text-gray-500">No Products Found</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.productName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-semibold">Barcode:</span> {p.barcode}
              </p>
              <p>
                <span className="font-semibold">Price:</span> ₹{p.price}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
