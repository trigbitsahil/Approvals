import React, { useCallback } from "react";
import clsx from "clsx";

interface ImageStepperProps {
  steps: number;
  activeStep: number;
  bottom?: string;
  left?: string;
  onChangeActiveStep: (step: number) => void;
}

const ImageStepper: React.FC<ImageStepperProps> = ({
  steps,
  activeStep,
  onChangeActiveStep,
  bottom,
  left,
}) => {
  return (
    <div
      className="flex justify-center items-center absolute"
      style={{
        bottom: bottom || "auto",
        left: left || "auto",
      }}
    >
      <StepperDots
        steps={steps}
        activeStep={activeStep}
        onChangeActiveStep={onChangeActiveStep}
      />
    </div>
  );
};

export default ImageStepper;

// -------------------------------
// StepperDots
// -------------------------------

interface StepperDotsProps {
  steps: number;
  activeStep: number;
  onChangeActiveStep: (index: number) => void;
}

export const StepperDots: React.FC<StepperDotsProps> = ({
  steps,
  activeStep,
  onChangeActiveStep,
}) => {
  const handleClick = useCallback(
    (event: any, index: number) => {
      onChangeActiveStep(index);
    },
    [onChangeActiveStep]
  );

  return (
    <div className="flex space-x-2">
      {Array(steps)
        .fill(0)
        .map((_, i) => (
          <StepperDot
            key={i}
            index={i}
            active={i === activeStep}
            onClick={handleClick}
          />
        ))}
    </div>
  );
};

// -------------------------------
// StepperDot
// -------------------------------

interface StepperDotProps {
  index: number;
  active: boolean;
  onClick: (event: any, index: number) => void;
}

const StepperDot: React.FC<StepperDotProps> = ({ index, active, onClick }) => {
  const handleClick = useCallback(
    (event: any) => {
      if (onClick) {
        onClick(event, index);
      }
    },
    [onClick, index]
  );

  return (
    <button
      className="w-3 h-3 rounded-full p-0 m-[2px] border-0 cursor-pointer flex items-center justify-center"
      onClick={handleClick}
    >
      <div
        className={clsx(
          "w-3 h-3 rounded-full transition-colors",
          active ? "bg-red-600" : "bg-gray-400 hover:bg-red-600"
        )}
      />
    </button>
  );
};
