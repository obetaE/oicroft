"use client"
import React, { useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import styles from "./PrivacyEditor.module.css"

const PrivacyEditor = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState(""); // To display user-friendly messages
  const [messageType, setMessageType] = useState(""); // To differentiate success and error messages

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const Quill = require("quill").default;

      const Font = Quill.import("formats/size");
      Font.whitelist = ["small", "normal", "large", "huge"];
      Quill.register(Font, true);

      const quillInstance = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        },
      });

      quillInstance.on("text-change", () => {
        const htmlContent = quillInstance.root.innerHTML;
        setContent(htmlContent);
      });
    }
  }, []);

  const handleSave = async () => {
    if (!content) {
      displayMessage("You can't send an empty message.", "error");
      return;
    }

    try {
      const response = await fetch("/api/privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        displayMessage("Privacy Policy saved successfully!", "success");
      } else {
        displayMessage("Failed to save. Please try again.", "error");
      }
    } catch (err) {
      console.error("Error saving content:", err);
      displayMessage(
        "An unexpected error occurred. Please try again.",
        "error"
      );
    }
  };

  const clearEditor = () => {
    if (typeof window !== "undefined") {
      const Quill = require("quill").default;
      const quillInstance = Quill.find(editorRef.current);
      quillInstance.setContents([]); // Clear the editor
      setContent(""); // Reset content state
      displayMessage("Editor cleared successfully!", "info");
    }
  };

  const displayMessage = (text, type) => {
    setMessage(text);
    setMessageType(type); // "success", "error", or "info"
    setTimeout(() => {
      setMessage(""); // Clear message after 5 seconds
      setMessageType("");
    }, 5000);
  };

  return (
    <div>
      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "10px",
            color:
              messageType === "success"
                ? "green"
                : messageType === "error"
                ? "red"
                : "blue",
            border: `1px solid ${
              messageType === "success"
                ? "green"
                : messageType === "error"
                ? "red"
                : "blue"
            }`,
            borderRadius: "5px",
          }}
        >
          {message}
        </div>
      )}
      <div
        ref={editorRef}
        style={{
          height: "300px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      ></div>
      <div className={styles.buttoncontainer}>
        <button
          className={styles.button}
          onClick={handleSave}
          style={{ marginRight: "10px" }}
        >
          Save
        </button>
        <button className={styles.button} onClick={clearEditor}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default PrivacyEditor;

