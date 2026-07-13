"use client";

import { useParams } from "react-router-dom";
import Product from "@/components/barcode/Product";

export default function ProductPage() {
  const params = useParams();
  const barcode = params.barcode as string;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Product Detail</h1>
      <Product barcode={barcode} />
    </div>
  );
}
