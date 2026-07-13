"use client";
import React, { type FunctionComponent, useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { isMobile } from "react-device-detect";
import LeftSidebar from "./LeftSidebar";
import DropContainerComponent from "./subcomponents/DropContainerComponent";
import EditPropertiesComponent from "./subcomponents/EditPropertiesComponent";
import FormPreview from "./subcomponents/FormPreview";
import useFormBuilder from "./hooks/useFormBuilder";
import useFormPreview from "./hooks/useFormPreview";
import { FormItemTypes } from "../../utils/formBuilderUtils";
import type { TemplateType } from "../../types/FormTemplateTypes";
import ConfirmationModal from "../ConfirmationModal";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Image, Eye, Send } from "lucide-react";

interface FormBuilderProps {
  template: TemplateType;
  isPublished?: boolean;
  formLinkName?: string | null;
}

const FormBuilder: FunctionComponent<FormBuilderProps> = ({
  template,
  isPublished,
  formLinkName,
}) => {
  const {
    handleItemAdded,
    saveForm,
    deleteContainer,
    deleteControl,
    editContainerProperties,
    editControlProperties,
    moveControl,
    moveControlFromSide,
    selectControl,
    updateFormName,
    selectedTemplate,
    formLayoutComponents,
    selectedControl,
  } = useFormBuilder({ template });

  const { showPreview, closePreviewDrawer } = useFormPreview();
  const [templateId, setTemplateId] = useState<string | null>(null);

  const handleConfirm = useCallback(() => {
    console.log("Publishing form with ID:", templateId);
    setTemplateId(null);
  }, [templateId]);

  const handleCancel = useCallback(() => {
    setTemplateId(null);
  }, []);

  const handleOpen = useCallback(
    (id: string) => () => {
      setTemplateId(id);
    },
    [],
  );

  // track a local copy of the name so we can edit it inline
  const [formName, setFormName] = useState<string>(
    selectedTemplate?.formName || "",
  );

  React.useEffect(() => {
    setFormName(selectedTemplate?.formName || "");
  }, [selectedTemplate]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormName(name);
    updateFormName(name);
  };

  if (isMobile) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Unsupported Device</h2>
          <p className="text-muted-foreground">
            Form Builder is only supported on desktop devices. Please switch to
            a desktop or tablet device.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="border-b bg-background p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {/* editable form name */}
              <Input
                className="text-xl font-semibold w-64"
                value={formName}
                onChange={onNameChange}
                placeholder="Untitled Form"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveForm(() => Promise.resolve())}
                disabled={isPublished}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`/posterbuilder/${template.id}`, "_blank")
                }
              >
                <Image className="mr-2 h-4 w-4" />
                Media
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/preview/${template.id}`, "_blank")}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleOpen(template.id)}
                disabled={isPublished}
              >
                <Send className="mr-2 h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="h-full overflow-y-auto border-r p-4">
              <LeftSidebar
                handleItemAdded={handleItemAdded}
                formLayoutComponents={formLayoutComponents}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Form Builder Area */}
          <ResizablePanel defaultSize={60}>
            <div className="h-full overflow-y-auto p-6">
              <div className="mx-auto max-w-3xl space-y-6">
                {formLayoutComponents.map((layout, ind) => (
                  <DropContainerComponent
                    key={layout.container.id}
                    index={ind}
                    layout={layout.container}
                    selectedControl={selectedControl}
                    childrenComponents={layout.children}
                    deleteContainer={deleteContainer}
                    deleteControl={deleteControl}
                    selectControl={selectControl}
                    accept={FormItemTypes.CONTROL}
                    moveControl={moveControl}
                  />
                ))}

                <DropContainerComponent
                  accept={FormItemTypes.CONTAINER}
                  name="Parent Component"
                  handleItemAdded={handleItemAdded}
                  length={formLayoutComponents.length}
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Properties Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="h-full overflow-y-auto border-l p-4">
              <EditPropertiesComponent
                selectedControl={selectedControl}
                selectControl={selectControl}
                formLayoutComponents={formLayoutComponents}
                moveControlFromSide={moveControlFromSide}
                editContainerProperties={editContainerProperties}
                editControlProperties={editControlProperties}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Form Preview Drawer */}
      <FormPreview
        formId={template.id}
        screenType="mobile"
        showPreview={showPreview}
        formLayoutComponents={formLayoutComponents}
        closePreviewDrawer={closePreviewDrawer}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        message="Are you sure you want to publish this form?"
        description="Once published, it cannot be changed."
        warnMessage={!formLinkName ? "Form Link name is added by default." : ""}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        open={Boolean(templateId)}
      />
    </DndProvider>
  );
};

export default FormBuilder;
