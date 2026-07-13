"use client";

import Scanner from "@/components/barcode/Scanner";
import AddProduct from "@/components/barcode/AddProduct";

export default function Page() {
  return (
    <div
      className="min-h-screen px-4 py-8 
      bg-white dark:bg-black 
      text-black dark:text-white"
    >
      <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <h1 className="text-xl md:text-2xl font-semibold">Barcode Page</h1>

        <AddProduct />
      </div>

      <div className="max-w-5xl mx-auto">
        <Scanner />
      </div>

      <div className="max-w-5xl mx-auto mt-10">
        <hr className="border-gray-300 dark:border-zinc-800" />
      </div>
    </div>
  );
}
