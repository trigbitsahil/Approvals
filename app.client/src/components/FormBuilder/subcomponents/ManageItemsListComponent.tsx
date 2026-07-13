import React, { type FC, useEffect, useState } from "react";
import { type FormLayoutCoponentChildrenItemsType } from "../../../types/FormTemplateTypes";
import { generateID } from "@/utils/common";

interface ManageItemsListComponentProps {
  items: FormLayoutCoponentChildrenItemsType[] | undefined;
  addItemInList: (item: FormLayoutCoponentChildrenItemsType) => void;
  deleteItemFromList: (item: FormLayoutCoponentChildrenItemsType) => void;
  editIteminList: (item: FormLayoutCoponentChildrenItemsType) => void;
}

const ManageItemsListComponent: FC<ManageItemsListComponentProps> = ({
  items,
  addItemInList,
  deleteItemFromList,
  editIteminList,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>("");
  const [editItemId, setEditItemId] = useState<string | undefined>(undefined);

  useEffect(() => {
    cancelEditing();
  }, [items]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setItemName(e.target.value);
  };

  const changeToEditMode = (item: FormLayoutCoponentChildrenItemsType) => {
    setItemName(item.label);
    setEditItemId(item.id);
    setEditMode(true);
  };

  const onSubmit: React.MouseEventHandler<HTMLInputElement> = () => {
    if (itemName.trim() !== "") {
      if (!editMode) {
        addItemInList({
          id: generateID(),
          value: itemName.trim(),
          label: itemName.trim(),
        });
      } else {
        editIteminList({
          id: editItemId as string,
          value: itemName.trim(),
          label: itemName.trim(),
        });
      }
    }
  };

  const cancelEditing = () => {
    setEditMode(false);
    setItemName("");
    setEditItemId(undefined);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Item Name"
        name="newItem"
        value={itemName}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2 mt-2">
        <input
          type="button"
          value={editMode ? "Edit Item" : "Add Item"}
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        />
        {editMode && (
          <input
            type="button"
            value="Cancel"
            onClick={cancelEditing}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 cursor-pointer"
          />
        )}
      </div>

      <ul className="mt-4 space-y-2">
        {items?.map((item) => (
          <li
            key={item.value}
            className="flex justify-between items-center px-4 py-2 border rounded shadow-sm"
          >
            <span>{item.label}</span>
            <div className="flex gap-2">
              <button
                onClick={() => changeToEditMode(item)}
                className="text-blue-500 hover:text-blue-700"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => deleteItemFromList(item)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageItemsListComponent;
