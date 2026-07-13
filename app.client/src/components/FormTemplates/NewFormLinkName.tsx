import type {
  ChangeEventHandler,
  FormEventHandler,
  FunctionComponent,
} from "react";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { addTemplate } from "../../redux/entities/formBuilderEntity";
import useModalStrip from "../../global-hooks/useModalStrip";

interface NewFormDialogComponentProps {
  open: boolean;
  setOpenDialog: () => void;
  formId: string;
}

interface NewFormDataLinkType {
  formLinkName: string;
  description: string;
}

const textboxStyle = {
  minWidth: "100%",
  maxWidth: "100%",
  marginTop: "20px",
  padding: "16px",
};

const NewFormLinkNameComponent: FunctionComponent<
  NewFormDialogComponentProps
> = (props) => {
  const dispatch = useAppDispatch();
  const { showModalStrip } = useModalStrip();

  const [linkNameError, setLinkNameError] = useState<string | null>(null);
  const [newFormLinkData, setNewFormLinkData] = useState<NewFormDataLinkType>({
    formLinkName: "",
    description: "",
  });

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    const val = value.split(" ").join("");
    setNewFormLinkData((prev) => ({ ...prev, [name]: val }));
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setNewFormLinkData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (newFormLinkData.formLinkName === "") {
      showModalStrip("danger", "Form name cannot be empty", 5000);
      return;
    }

    // Simulate API call
    try {
      const isDuplicate = false; // replace with actual check if needed

      if (isDuplicate) {
        setLinkNameError("Name Already Exist");
      } else {
        props.setOpenDialog();
      }
    } catch (ex) {
      showModalStrip(
        "danger",
        "Error occurred while creating a new Form",
        5000
      );
    }
  };

  if (!props.open) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fff",
          padding: "2rem",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span style={{ padding: "9px", cursor: "pointer" }}>
            <i className="fas fa-arrow-left"></i>
          </span>
          <span
            style={{ padding: "9px", cursor: "pointer" }}
            onClick={props.setOpenDialog}
          >
            <i className="fas fa-times"></i>
          </span>
        </div>

        <div className="p-30" style={{ minHeight: "300px" }}>
          <div style={{ maxWidth: "360px", margin: "0 auto" }}>
            <h4>Enter the following details:</h4>
            <form onSubmit={handleFormSubmit} style={{ minWidth: "100%" }}>
              <div>
                <input
                  type="text"
                  name="formLinkName"
                  value={newFormLinkData.formLinkName}
                  onChange={handleInputChange}
                  placeholder="Form Link Name"
                  style={textboxStyle}
                />
                {linkNameError && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {linkNameError}
                  </div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="description"
                  value={newFormLinkData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Description"
                  style={textboxStyle}
                />
              </div>

              <button
                className="btn btn-light btn-shadow m-t-20 m-r-10"
                type="submit"
              >
                Create link name
              </button>
              <input
                type="button"
                className="btn btn-light btn-shadow m-t-20 m-l-0"
                value="Cancel"
                onClick={props.setOpenDialog}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFormLinkNameComponent;
