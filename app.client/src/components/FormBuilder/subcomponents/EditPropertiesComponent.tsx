"use client";

import React, { FC, useEffect, useState } from "react";
import ManageItemsListComponent from "./ManageItemsListComponent";
import type {
  FormLayoutComponentChildrenType,
  FormLayoutComponentContainerType,
  FormLayoutCoponentChildrenItemsType,
} from "../../../types/FormTemplateTypes";
import { FormControlNames, FormItemTypes } from "@/utils/formBuilderUtils";
import _ from "lodash";
import useModalStrip from "../../../global-hooks/useModalStrip";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface EditPropertiesComponentProps {
  selectedControl?:
  | FormLayoutComponentChildrenType
  | FormLayoutComponentContainerType;
  selectControl?: (
    layout?: FormLayoutComponentChildrenType | FormLayoutComponentContainerType
  ) => void;
  editControlProperties: (updatedItem: FormLayoutComponentChildrenType) => void;
  editContainerProperties: (
    updatedItem: FormLayoutComponentContainerType
  ) => void;
  formLayoutComponents: {
    container: FormLayoutComponentContainerType;
    children: FormLayoutComponentChildrenType[];
  }[];
  moveControlFromSide: (
    selectedControl: FormLayoutComponentChildrenType,
    moveControlObj: FormLayoutComponentChildrenType
  ) => void;
}

const textboxClass = "w-full border rounded px-2 py-1 mt-2";

const EditPropertiesComponent: FC<EditPropertiesComponentProps> = ({
  selectedControl,
  selectControl,
  editControlProperties,
  editContainerProperties,
  formLayoutComponents,
  moveControlFromSide,
}) => {
  const [updatedItem, setUpdatedItem] = useState<any>({});
  const [isRequired, setIsRequired] = useState(false);
  const [moveControlObj, setMoveControlObj] = useState<any>(null);
  const [controlsInContainer, setControlsInContainer] = useState<number>();

  const { showModalStrip } = useModalStrip();

  useEffect(() => {
    if (selectedControl) {
      const copy = _.cloneDeep(selectedControl);
      setUpdatedItem(copy);
      if ("required" in copy) setIsRequired((copy as any).required);
    }
    setMoveControlObj(null);
    setControlsInContainer(undefined);
  }, [selectedControl]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value });
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "required") setIsRequired(checked);
    setUpdatedItem({ ...updatedItem, [name]: checked });
  };

  const addItemInList = (item: FormLayoutCoponentChildrenItemsType) => {
    setUpdatedItem({
      ...updatedItem,
      items: [...(updatedItem.items || []), item],
    });
  };

  const deleteItemFromList = (item: FormLayoutCoponentChildrenItemsType) => {
    setUpdatedItem({
      ...updatedItem,
      items: updatedItem.items.filter((i: any) => i.id !== item.id),
    });
  };

  const editItemInList = (item: FormLayoutCoponentChildrenItemsType) => {
    const items = updatedItem.items.map((i: any) =>
      i.id === item.id ? { ...i, value: item.value, label: item.label } : i
    );
    setUpdatedItem({ ...updatedItem, items });
  };

  const handleMoveSelectChange = (e: any) => {
    const { name, value } = e.target;
    const updated = { ...moveControlObj, [name]: value };
    if (name === "containerId") {
      const container = formLayoutComponents.find(
        (c) => c.container.id === value
      );
      const count = container
        ? container.children.length - (selectedControl as any).containerId ===
          value
          ? 1
          : 0
        : 0;
      setControlsInContainer(count + 1);
    }
    setMoveControlObj(updated);
  };

  const getPositions = () =>
    Array.from({ length: (controlsInContainer ?? 0) + 1 }, (_, i) => (
      <SelectItem key={i} value={`${i}`}>
        {i + 1}
      </SelectItem>
    ));

  const onControlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editControlProperties(updatedItem);
  };

  const onContainerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editContainerProperties(updatedItem);
  };

  const onMoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveControlObj?.containerId) {
      showModalStrip("danger", "You need to select Step first", 5000);
      return;
    }
    moveControlFromSide(selectedControl as any, moveControlObj);
  };

  if (!selectedControl) {
    return (
      <div>
        <h4>Edit Properties</h4>
        <div role="alert" className="mt-8 bg-gray-100 p-4 rounded">
          <strong>Note!</strong> You need to select a container/control to edit
          properties.
        </div>
      </div>
    );
  }

  const isContainer =
    (selectedControl as any).itemType === FormItemTypes.CONTAINER;

  return (
    <div className="space-y-8">
      {isContainer ? (
        <form onSubmit={onContainerSubmit} className="space-y-4">
          <h4 className="text-lg font-semibold">Edit Container Properties</h4>
          <Input
            name="heading"
            placeholder="Container Heading"
            value={(updatedItem as any).heading || ""}
            onChange={handleTextChange}
            className={textboxClass}
          />
          <Input
            name="subHeading"
            placeholder="Container Sub-heading"
            value={(updatedItem as any).subHeading || ""}
            onChange={handleTextChange}
            className={textboxClass}
          />
          <div className="flex space-x-2">
            <button type="submit" className="btn btn-light">
              Update Data
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => selectControl?.()}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <form onSubmit={onControlSubmit} className="space-y-4">
            <h4 className="text-lg font-semibold">Edit Field Properties</h4>

            <Input
              name="labelName"
              placeholder="Field Label Name"
              value={(updatedItem as any).labelName || ""}
              onChange={handleTextChange}
              className={textboxClass}
            />

            {[
              FormControlNames.INPUTTEXTFIELD,
              FormControlNames.INPUTNUMBERFIELD,
              FormControlNames.INPUTMULTILINE,
              FormControlNames.CHECKBOX,
            ].includes((updatedItem as any).controlName) && (
                <Input
                  name="placeholder"
                  placeholder="Field Placeholder"
                  value={(updatedItem as any).placeholder || ""}
                  onChange={handleTextChange}
                  className={textboxClass}
                />
              )}

            <Textarea
              name="description"
              placeholder="Field Description"
              value={(updatedItem as any).description || ""}
              onChange={handleTextChange}
              className={textboxClass}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                name="required"
                checked={isRequired}
                onCheckedChange={(checked) => {
                  setIsRequired(checked);
                  setUpdatedItem({ ...updatedItem, required: checked });
                }}
              />
              <span>Required</span>
            </div>

            {[
              FormControlNames.RADIOGROUP,
              FormControlNames.SELECTDROPDOWN,
              FormControlNames.CHECKLIST,
              FormControlNames.MULTISELECT,
              FormControlNames.UNIVERSITYDROPDOWN,
            ].includes((updatedItem as any).controlName) && (
                <>
                  <h5 className="text-md font-medium">List Items</h5>
                  <ManageItemsListComponent
                    addItemInList={addItemInList}
                    editIteminList={editItemInList}
                    deleteItemFromList={deleteItemFromList}
                    items={(updatedItem as any).items}
                  />
                </>
              )}

            <div className="flex space-x-2">
              <button type="submit" className="btn btn-light">
                Update Data
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => selectControl?.()}
              >
                Cancel
              </button>
            </div>
          </form>

          <form onSubmit={onMoveSubmit} className="space-y-4">
            <h4 className="text-lg font-semibold">Move Control to Step</h4>

            <div>
              <span className="block mb-1">Step:</span>
              <Select
                name="containerId"
                value={moveControlObj?.containerId || ""}
                onValueChange={(val) =>
                  handleMoveSelectChange({
                    target: { name: "containerId", value: val },
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Step" />
                </SelectTrigger>
                <SelectContent>
                  {formLayoutComponents.map((step, idx) => (
                    <SelectItem
                      key={step.container.id}
                      value={step.container.id}
                    >
                      Step {idx + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <span className="block mb-1">Position:</span>
              <Select
                name="position"
                value={moveControlObj?.position || ""}
                onValueChange={(val) =>
                  handleMoveSelectChange({
                    target: { name: "position", value: val },
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>{getPositions()}</SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="btn btn-light">
                Move
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => selectControl?.()}
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default EditPropertiesComponent;
