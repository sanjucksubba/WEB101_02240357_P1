import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(""); // "", "uploading", "success", "error"
  const [fileError, setFileError] = useState("");
  const [serverResponse, setServerResponse] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // ─── File Validation ──────────────────────────────────────────────────────
  const validateFile = (file) => {
    if (!file) {
      return "Please select a file.";
    }

    const allowedTypes = Object.keys(ACCEPTED_FILE_TYPES);
    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Only JPG, PNG, GIF, and PDF files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File is too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
    }

    return null; // no error
  };

  // ─── Drag and Drop Interface (react-dropzone) ─────────────────────────────
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setFileError("");
      setUploadedFile(null);

      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setFileError(
            `File is too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
          );
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setFileError(
            "Invalid file type. Only JPG, PNG, GIF, and PDF files are allowed."
          );
        } else {
          setFileError("File rejected: " + rejection.errors[0]?.message);
        }
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const error = validateFile(file);
        if (error) {
          setFileError(error);
          return;
        }
        setUploadedFile(file);
        // Sync the file with React Hook Form
        setValue("file", acceptedFiles, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_FILE_TYPES,
      maxSize: MAX_FILE_SIZE,
      multiple: false,
    });

  // ─── Handle Manual File Input Change ─────────────────────────────────────
  const handleFileInputChange = (e) => {
    setFileError("");
    setUploadedFile(null);

    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFileError(error);
      return;
    }

    setUploadedFile(file);
  };

  // ─── Form Submit → Upload with Progress Tracking ─────────────────────────
  const onSubmit = async (data) => {
    if (!uploadedFile) {
      setFileError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("description", data.description || "");

    setUploadStatus("uploading");
    setUploadProgress(0);
    setServerResponse(null);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // ── Progress Tracking ──────────────────────────────────────────────
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setUploadStatus("success");
      setServerResponse(response.data);
      reset();
      setUploadedFile(null);
      setUploadProgress(0);
    } catch (error) {
      setUploadStatus("error");
      setServerResponse(
        error.response?.data || { message: "Upload failed. Please try again." }
      );
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadStatus("");
    setFileError("");
    setServerResponse(null);
    reset();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📁 File Upload</h1>
        <p style={styles.subheading}>
          Upload JPG, PNG, GIF or PDF files (max 5MB)
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          {/* ── Drag and Drop Zone ───────────────────────────────────────── */}
          <div
            {...getRootProps()}
            style={{
              ...styles.dropzone,
              ...(isDragActive && !isDragReject ? styles.dropzoneActive : {}),
              ...(isDragReject ? styles.dropzoneReject : {}),
              ...(uploadedFile ? styles.dropzoneSuccess : {}),
            }}
          >
            {/* Hidden input managed by react-dropzone */}
            <input {...getInputProps()} />

            {uploadedFile ? (
              <div style={styles.filePreview}>
                <span style={styles.fileIcon}>
                  {uploadedFile.type.startsWith("image/") ? "🖼️" : "📄"}
                </span>
                <div>
                  <p style={styles.fileName}>{uploadedFile.name}</p>
                  <p style={styles.fileSize}>
                    {formatFileSize(uploadedFile.size)} &bull;{" "}
                    {uploadedFile.type}
                  </p>
                </div>
              </div>
            ) : isDragActive && !isDragReject ? (
              <p style={styles.dropzoneText}>Drop the file here…</p>
            ) : isDragReject ? (
              <p style={{ ...styles.dropzoneText, color: "#e53e3e" }}>
                ❌ This file type is not supported!
              </p>
            ) : (
              <div style={styles.dropzoneContent}>
                <span style={styles.dropzoneIcon}>☁️</span>
                <p style={styles.dropzoneText}>
                  Drag & drop a file here, or{" "}
                  <span style={styles.browseLink}>browse</span>
                </p>
                <p style={styles.dropzoneHint}>
                  Supports JPG, PNG, GIF, PDF — up to 5MB
                </p>
              </div>
            )}
          </div>

          {/* ── OR: Manual File Input ────────────────────────────────────── */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="fileInput">
              Or select a file manually:
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.pdf"
              onChange={handleFileInputChange}
              style={styles.fileInput}
            />
          </div>

          {/* ── File Validation Error ────────────────────────────────────── */}
          {fileError && <p style={styles.errorText}>⚠️ {fileError}</p>}

          {/* ── Description Field ────────────────────────────────────────── */}
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="description">
              Description (optional):
            </label>
            <input
              id="description"
              type="text"
              placeholder="Enter a description for the file…"
              style={styles.input}
              {...register("description", {
                maxLength: {
                  value: 200,
                  message: "Description cannot exceed 200 characters.",
                },
              })}
            />
            {errors.description && (
              <p style={styles.errorText}>⚠️ {errors.description.message}</p>
            )}
          </div>

          {/* ── Upload Progress Bar ──────────────────────────────────────── */}
          {uploadStatus === "uploading" && (
            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={styles.progressBarBg}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Success / Error Status Messages ─────────────────────────── */}
          {uploadStatus === "success" && serverResponse && (
            <div style={styles.successBox}>
              <p style={styles.successTitle}>✅ Upload Successful!</p>
              <p>
                <strong>File:</strong> {serverResponse.fileName}
              </p>
              <p>
                <strong>Size:</strong> {serverResponse.fileSize}
              </p>
              <p>
                <strong>Type:</strong> {serverResponse.fileType}
              </p>
            </div>
          )}

          {uploadStatus === "error" && serverResponse && (
            <div style={styles.errorBox}>
              <p>❌ {serverResponse.message}</p>
            </div>
          )}

          {/* ── Action Buttons ───────────────────────────────────────────── */}
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={uploadStatus === "uploading"}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...(uploadStatus === "uploading"
                  ? styles.buttonDisabled
                  : {}),
              }}
            >
              {uploadStatus === "uploading" ? "Uploading…" : "Upload File"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Inline Styles ────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "520px",
  },
  heading: {
    margin: "0 0 0.25rem 0",
    fontSize: "1.8rem",
    color: "#1a202c",
  },
  subheading: {
    margin: "0 0 2rem 0",
    color: "#718096",
    fontSize: "0.95rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  dropzone: {
    border: "2px dashed #cbd5e0",
    borderRadius: "10px",
    padding: "2rem 1.5rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    backgroundColor: "#f7fafc",
    outline: "none",
  },
  dropzoneActive: {
    borderColor: "#4299e1",
    backgroundColor: "#ebf8ff",
  },
  dropzoneReject: {
    borderColor: "#fc8181",
    backgroundColor: "#fff5f5",
  },
  dropzoneSuccess: {
    borderColor: "#68d391",
    backgroundColor: "#f0fff4",
  },
  dropzoneContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  dropzoneIcon: {
    fontSize: "2.5rem",
  },
  dropzoneText: {
    margin: 0,
    color: "#4a5568",
    fontSize: "0.95rem",
  },
  browseLink: {
    color: "#4299e1",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
  dropzoneHint: {
    margin: 0,
    color: "#a0aec0",
    fontSize: "0.80rem",
  },
  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    textAlign: "left",
  },
  fileIcon: {
    fontSize: "2rem",
  },
  fileName: {
    margin: 0,
    fontWeight: "600",
    color: "#2d3748",
    wordBreak: "break-all",
  },
  fileSize: {
    margin: 0,
    color: "#718096",
    fontSize: "0.82rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontWeight: "600",
    color: "#4a5568",
    fontSize: "0.9rem",
  },
  input: {
    padding: "0.6rem 0.9rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  fileInput: {
    padding: "0.4rem 0",
    fontSize: "0.9rem",
    color: "#4a5568",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "0.85rem",
    margin: 0,
  },
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#4a5568",
    fontWeight: "600",
  },
  progressBarBg: {
    width: "100%",
    height: "12px",
    borderRadius: "999px",
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "999px",
    backgroundColor: "#4299e1",
    transition: "width 0.3s ease",
  },
  successBox: {
    backgroundColor: "#f0fff4",
    border: "1px solid #9ae6b4",
    borderRadius: "8px",
    padding: "1rem 1.25rem",
    color: "#276749",
    fontSize: "0.9rem",
    lineHeight: "1.7",
  },
  successTitle: {
    margin: "0 0 0.5rem 0",
    fontWeight: "700",
    fontSize: "1rem",
  },
  errorBox: {
    backgroundColor: "#fff5f5",
    border: "1px solid #fc8181",
    borderRadius: "8px",
    padding: "0.85rem 1.25rem",
    color: "#c53030",
    fontSize: "0.9rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.75rem",
  },
  button: {
    flex: 1,
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s, opacity 0.2s",
  },
  primaryButton: {
    backgroundColor: "#4299e1",
    color: "#ffffff",
  },
  secondaryButton: {
    backgroundColor: "#edf2f7",
    color: "#4a5568",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};