"use client";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ButtonToHome: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = useCallback(() => {
    navigate(-1); // Equivalent to goBack
  }, []);
  return (
    <Button
      onClick={handleButtonClick}
      color="primary"
      variant="outline"
      className="m-2"
    >
      Back
    </Button>
  );
};

export default ButtonToHome;
