"use client";
import React from "react";
import { useAppSelector } from "../redux/hooks";

const BackdropCircularProgressComponent: React.FC = () => {
  const isCircularProgressOpen = useAppSelector(
    (state) => state.uielements.progress.isCircularProgressOpen
  );

  if (!isCircularProgressOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
    </div>
  );
};

export default BackdropCircularProgressComponent;
