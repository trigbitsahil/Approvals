"use client";

import React, { type FC, useCallback, useRef, useState } from "react";
import RenderItem from "./RenderItem";
import type { FormLayoutComponentsType } from "../../../../types/FormTemplateTypes";
import ReCAPTCHA from "react-google-recaptcha";

const maxFileSize = 10 * 1024 * 1024;

const previewWindowStyle = {
  backgroundColor: "white",
  overflowY: "scroll",
};

interface StepperFormPreviewProps {
  showPreview: boolean;
  formId: string;
  formLayoutComponents: FormLayoutComponentsType[];
  screenType: string;
}

let formArray: { [key: string]: any }[] = [];

const StepperFormPreview: FC<StepperFormPreviewProps> = ({
  showPreview,
  formId,
  formLayoutComponents,
  screenType,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [componentIndex, setComponentIndex] = useState(0);
  const [progress, setProgress] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const component = formLayoutComponents[componentIndex];

  const handleSelectedFile = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleReset = useCallback(() => {
    formRef.current?.reset();
    recaptchaRef.current?.reset();
    setSelectedFile(null);
    window.location.reload(); // fallback for useRouter().refresh()
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      try {
        setError(null);
        setProgress(true);
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const recaptchaValue = recaptchaRef?.current?.getValue();

        if (!recaptchaValue) {
          throw new Error("reCAPTCHA verification failed.");
        }

        const accumulatedObject: { [key: string]: any } = {};

        formData.forEach((value, key) => {
          if (key === "g-recaptcha-response") return;

          if (value instanceof File) {
            const urlKey = `url-${key}`;
            const url = formData.get(urlKey);
            if (value.size > maxFileSize) {
              throw new Error("File size exceeds 10MB");
            }
            accumulatedObject[key] = url || value.name;
            formData.delete(urlKey);
          } else if (value === "on") {
            accumulatedObject[key] = true;
          } else {
            accumulatedObject[key] = value;
          }
        });

        formArray.push(accumulatedObject);

        // Simulated submission (replace with your backend call)
        console.log("SUBMISSION PAYLOAD:", {
          token: recaptchaValue,
          formAlternateId: formId,
          jsonData: JSON.stringify(formArray),
        });

        setProgress(false);
        setSubmitCount((prev) => prev + 1);
        btnRef.current?.click();
        alert("Form submitted successfully");
      } catch (err: any) {
        setProgress(false);
        setError(err.message || "Form submission failed");
      }
    },
    [formId]
  );

  const isMobile = screenType === "mobile";

  return formLayoutComponents.length > 0 ? (
    <div className="">
      <div
        style={{
          ...(previewWindowStyle as any),
          width: isMobile ? "100%" : "initial",
          maxHeight: "100dvh",
        }}
        className="p-8"
      >
        <form
          ref={formRef}
          onSubmit={showPreview ? () => { } : handleSubmit}
          style={{ minWidth: "100%" }}
        >
          <div className="my-4">
            <h4 className="text-xl">{component.container.heading}</h4>
            <p>{component.container.subHeading}</p>
          </div>

          {component.children.map((child) => (
            <div key={child.id} className="my-4 w-full md:w-1/2 px-2 min-h-20">
              <h5 className="text-base">
                {child.labelName + (child.required ? " *" : "")}
              </h5>
              {child.description && (
                <p className="text-sm mb-2">{child.description}</p>
              )}

              <RenderItem
                key={child.id + submitCount}
                item={child}
                onSelectedFile={handleSelectedFile}
                selectedFile={selectedFile}
              />
            </div>
          ))}

          <div className="mt-4">
            <ReCAPTCHA sitekey={"YOUR_RECAPTCHA_SITE_KEY"} ref={recaptchaRef} />
          </div>

          {componentIndex + 1 === formLayoutComponents.length && (
            <div className="mt-6 px-2">
              <input
                type="submit"
                disabled={showPreview || progress}
                value="Submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              />
            </div>
          )}

          <button
            onClick={handleReset}
            ref={btnRef}
            type="reset"
            className="hidden"
          />
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  ) : (
    <div className="mt-10">
      <p>You need to add Containers and Controls to see output here.</p>
    </div>
  );
};

export default StepperFormPreview;
