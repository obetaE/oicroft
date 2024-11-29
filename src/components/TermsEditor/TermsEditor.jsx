"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css"; // Import Quill styles

const TermsEditor = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");

  // Dynamically import Quill to ensure it runs only in the browser
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const Quill = require("quill").default; // Access the default export
      const quillInstance = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        },
      });

      // Update state when the content changes
      quillInstance.on("text-change", () => {
        const htmlContent = quillInstance.root.innerHTML;
        setContent(htmlContent);
      });
    }
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Terms and Conditions", content }),
      });

      if (response.ok) {
        alert("Terms and Conditions saved successfully!");
      } else {
        alert("Failed to save. Please try again.");
      }
    } catch (err) {
      console.error("Error saving content:", err);
    }
  };

  return (
    <div>
      <h1>Terms and Conditions Editor</h1>
      <div ref={editorRef} style={{ height: "300px" }}></div>
      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        Save
      </button>
    </div>
  );
};

export default TermsEditor;
