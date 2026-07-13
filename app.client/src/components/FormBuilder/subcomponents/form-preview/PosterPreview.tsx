"use client";
import React, { type FC, useCallback, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import ImageStepper from "../../../ImageStepper";
import {
  FileType,
  type IDocument,
} from "@/modules/formsContentFiles/interface";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

interface StepperFormPreviewProps {
  screenType: string;
  data: IDocument[];
}

const getPreview = (item: IDocument) => {
  switch (item.type) {
    case FileType.POSTER:
      return (
        <div
          style={{ backgroundImage: `url(${item.url})` }}
          className="relative h-screen bg-contain bg-center bg-no-repeat"
        ></div>
      );

    case FileType.PDF:
      return (
        <div className="w-full text-center h-full">
          <embed src={item.url} height="100%" width="100%" />
        </div>
      );

    default:
      return null;
  }
};

const getSlideShowPreview = (
  data: IDocument[],
  handleStepChange: (index: number) => void,
  activeStep: number
) => {
  return (
    <>
      <AutoPlaySwipeableViews
        autoplay
        axis="x"
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        interval={2000}
      >
        {data.map((post: any) => (
          <div
            key={post?.id}
            style={{ backgroundImage: `url(${post.url})` }}
            className="relative h-screen bg-contain bg-center bg-no-repeat"
          ></div>
        ))}
      </AutoPlaySwipeableViews>

      {data.length > 0 && (
        <ImageStepper
          steps={data.length}
          activeStep={activeStep}
          onChangeActiveStep={handleStepChange}
        />
      )}
    </>
  );
};

const FormImagePreview: FC<StepperFormPreviewProps> = ({
  data,
  screenType,
}) => {
  const isSlideShow = data.every((value) => value.type === FileType.SLIDESHOW);
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const isMobile = screenType === "mobile";

  const handleStepChange = useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  const handleStartAutoPlay = useCallback(() => {
    setAutoPlay(true);
  }, []);

  const handleLeaveAutoPlay = useCallback(() => {
    setAutoPlay(false);
    setActiveStep(0);
  }, []);

  return (
    <div
      onMouseEnter={handleStartAutoPlay}
      onMouseLeave={handleLeaveAutoPlay}
      className="w-full h-full"
    >
      <div className="h-full">
        <div
          className={`w-full ${
            isMobile ? "h-auto" : "h-screen"
          } overflow-y-scroll bg-white`}
        >
          {data && data.length > 0 && isSlideShow
            ? getSlideShowPreview(data, handleStepChange, activeStep)
            : getPreview(data[0])}
        </div>
      </div>
    </div>
  );
};

export default FormImagePreview;
