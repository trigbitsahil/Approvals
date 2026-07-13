(function () {
  const button = document.getElementById("openFormBtn");
  const formId = button?.getAttribute("data-form-id");

  if (!formId) {
    alert("Form ID is missing!");
    return;
  }

  const previewUrl = `https://localhost:5173/form-preview/${formId}`;

  button.onclick = () => {
    const overlay = document.createElement("div");
    overlay.className = "form-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "form-modal";

    const closeBtn = document.createElement("button");
    closeBtn.className = "form-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = () => document.body.removeChild(overlay);

    const iframe = document.createElement("iframe");
    iframe.className = "form-iframe";
    iframe.src = previewUrl;

    modal.appendChild(closeBtn);
    modal.appendChild(iframe);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  };
})();
