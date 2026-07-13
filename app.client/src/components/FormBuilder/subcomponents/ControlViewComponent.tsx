"use client";

import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier } from "dnd-core";
import type { FormLayoutComponentChildrenType } from "../../../types/FormTemplateTypes";
import { FormControlNames, FormItemTypes } from "@/utils/formBuilderUtils";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const selectedColor = "border-primary";
const nonSelectedColor = "border-gray-300";

const renderItem = (item: FormLayoutComponentChildrenType) => {
  switch (item.controlName) {
    case FormControlNames.INPUTTEXTFIELD:
    case FormControlNames.INPUTEMAILFIELD:
    case FormControlNames.INPUTNUMBERFIELD:
      return (
        <Input type={item.dataType} disabled placeholder={item.placeholder} />
      );

    case FormControlNames.INPUTMULTILINE:
      return (
        <Textarea disabled placeholder={item.placeholder} rows={item.rows} />
      );

    case FormControlNames.CHECKBOX:
      return (
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox id={`checkbox-${item.id}`} disabled />
          <label htmlFor={`checkbox-${item.id}`} className="text-sm">
            {item.placeholder}
          </label>
        </div>
      );

    case FormControlNames.RADIOGROUP:
      return (
        <RadioGroup className="flex flex-row space-x-4" disabled>
          {item.items?.map((i) => (
            <div key={i.value} className="flex items-center space-x-2">
              <RadioGroupItem value={i.value} id={`radio-${i.value}`} />
              <label htmlFor={`radio-${i.value}`} className="text-sm">
                {i.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      );

    case FormControlNames.SELECTDROPDOWN:
    case FormControlNames.MULTISELECT:
    case FormControlNames.UNIVERSITYDROPDOWN:
      return (
        <Select disabled defaultValue={item.items?.[0]?.value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {item.items?.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case FormControlNames.DATEFIELD:
      return <Input type="date" disabled className="w-full" />;

    case FormControlNames.TIMEFIELD:
      return <Input type="time" disabled className="w-full" />;

    case FormControlNames.FILEUPLOAD:
      return (
        <div>
          <input
            type="file"
            id={item.controlName + item.id}
            className="hidden"
            disabled
          />
          <label
            htmlFor={item.controlName + item.id}
            className="cursor-pointer text-blue-600 underline"
          >
            <i className="fas fa-cloud-upload-alt"></i> Upload
          </label>
        </div>
      );

    case FormControlNames.CHECKLIST:
      return (
        <div className="flex flex-col gap-2 mt-2">
          {item.items?.map((i) => (
            <div key={i.value} className="flex items-center space-x-2">
              <Checkbox
                id={`checklist-${i.value}`}
                name={item.labelName}
                disabled
              />
              <label htmlFor={`checklist-${i.value}`} className="text-sm">
                {i.label}
              </label>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

interface ControlViewComponentProps {
  item: FormLayoutComponentChildrenType;
  deleteControl: (itemId: string, containerId: string) => void;
  containerId: string;
  selectControl: (item: FormLayoutComponentChildrenType) => void;
  selectedControl: FormLayoutComponentChildrenType | null;
  index: number;
  moveControl: (
    item: FormLayoutComponentChildrenType,
    dragIndex: number,
    hoverIndex: number,
    containerId: string
  ) => void;
}

export default function ControlViewComponent({
  item,
  deleteControl,
  containerId,
  selectControl,
  selectedControl,
  index,
  moveControl,
}: ControlViewComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    FormLayoutComponentChildrenType,
    void,
    { handlerId: Identifier | null }
  >({
    accept: FormItemTypes.CONTROL,
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(dragItem, monitor) {
      if (!ref.current) return;
      const dragIndex = dragItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const { top, bottom } = ref.current.getBoundingClientRect();
      const hoverMiddleY = (bottom - top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverY = clientOffset!.y - top;
      if (dragIndex < hoverIndex && hoverY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverY > hoverMiddleY) return;

      moveControl(dragItem, dragIndex, hoverIndex, containerId);
      dragItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: FormItemTypes.CONTROL,
    item: () => ({ ...item, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  const isSelected = selectedControl?.id === item.id;
  const borderClass = isSelected ? selectedColor : nonSelectedColor;

  return (
    <div
      ref={ref}
      className={`w-full p-4 mb-4 rounded-lg bg-white shadow ${borderClass}`}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "pointer" }}
      onClick={() => selectControl(item)}
    >
      <div className="flex items-center justify-between">
        <h5 className="text-base font-semibold">
          {item.labelName}
          {item.required && " *"}
        </h5>
        <div className="flex space-x-4">
          <span className="cursor-grab text-gray-500">
            <i className="fa fa-ellipsis-v" />
            <i className="fa fa-ellipsis-v" />
          </span>
          <span
            onClick={(e) => {
              deleteControl(item.id, containerId);
              e.stopPropagation();
            }}
            className="cursor-pointer text-red-500"
          >
            <i className="fa fa-trash" />
          </span>
        </div>
      </div>

      {item.description && (
        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
      )}

      <div className="mt-3">{renderItem(item)}</div>
    </div>
  );
}
