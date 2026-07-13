"use client";

import { useState } from "react";
import { addProduct } from "@/api/services/productApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";

export default function AddProduct() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    productName: "",
    barcode: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addProduct({
        productName: product.productName,
        barcode: product.barcode,
        price: Number(product.price),
      });

      setProduct({
        productName: "",
        barcode: "",
        price: "",
      });

      setOpen(false);
    } catch {
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="(above classes)">
            <Plus size={16} />
            Add Product
          </Button>
        </DialogTrigger>

        <DialogContent
          className="
          bg-white dark:bg-zinc-900
          text-black dark:text-white
          border border-gray-200 dark:border-zinc-800
          rounded-2xl shadow-2xl"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add New Product
            </DialogTitle>

            <DialogDescription className="text-gray-500 dark:text-zinc-400">
              Fill product name, barcode and price.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              name="productName"
              placeholder="Product Name"
              value={product.productName}
              onChange={handleChange}
              required
              className="
                bg-gray-100 dark:bg-zinc-800
                border border-gray-300 dark:border-zinc-700
                focus:ring-2 focus:ring-purple-600
                text-black dark:text-white"
            />

            <Input
              name="barcode"
              placeholder="Barcode"
              value={product.barcode}
              onChange={handleChange}
              required
              className="
                bg-gray-100 dark:bg-zinc-800
                border border-gray-300 dark:border-zinc-700
                focus:ring-2 focus:ring-purple-600
                text-black dark:text-white"
            />

            <Input
              name="price"
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
              required
              className="
                bg-gray-100 dark:bg-zinc-800
                border border-gray-300 dark:border-zinc-700
                focus:ring-2 focus:ring-purple-600
                text-black dark:text-white"
            />
            <Button
              type="submit"
              disabled={loading}
              className="
     w-full
      bg-primary
    text-primary-foreground
    hover:bg-primary/90
    active:scale-[0.98]
    transition-all
    duration-200
    shadow-md
  "
            >
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
