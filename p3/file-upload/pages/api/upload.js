import formidable from "formidable";
import path from "path";
import fs from "fs";

// ─── Disable Next.js default body parser ─────────────────────────────────────
// We must disable it so that formidable can parse the multipart/form-data body.
export const config = {
  api: {
    bodyParser: false,
  },
};

// ─── Allowed file types and max size ─────────────────────────────────────────
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// ─── Helper: parse multipart form with formidable ────────────────────────────
const parseForm = (req, uploadDir) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir,                    // directory where uploaded files are saved
      keepExtensions: true,         // preserve the original file extension
      maxFileSize: MAX_FILE_SIZE,   // enforce 5MB limit on the server side
      multiples: false,             // accept only a single file
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

// ─── API Handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed. Use POST." });
  }

  // Ensure the uploads directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    // ── Parse the multipart form data ────────────────────────────────────────
    const { fields, files } = await parseForm(req, uploadDir);

    // ── Extract the uploaded file ─────────────────────────────────────────
    // formidable v3 wraps files in arrays; handle both v2 and v3
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ message: "No file was uploaded." });
    }

    // ── Server-side File Type Validation ─────────────────────────────────────
    const mimeType = uploadedFile.mimetype;
    if (!ALLOWED_TYPES.includes(mimeType)) {
      // Remove the rejected file from disk
      fs.unlinkSync(uploadedFile.filepath);
      return res.status(400).json({
        message: `Invalid file type: "${mimeType}". Only JPG, PNG, GIF, and PDF are allowed.`,
      });
    }

    // ── Server-side File Size Validation ──────────────────────────────────────
    if (uploadedFile.size > MAX_FILE_SIZE) {
      fs.unlinkSync(uploadedFile.filepath);
      return res.status(400).json({
        message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      });
    }

    // ── Rename the temp file to a safe, timestamped filename ──────────────────
    const originalName = uploadedFile.originalFilename || "upload";
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension).replace(/[^a-z0-9_-]/gi, "_");
    const newFileName = `${Date.now()}_${baseName}${extension}`;
    const newFilePath = path.join(uploadDir, newFileName);

    fs.renameSync(uploadedFile.filepath, newFilePath);

    // ── Format file size for the response ────────────────────────────────────
    const formatSize = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    // ── Success Response ──────────────────────────────────────────────────────
    return res.status(200).json({
      message: "File uploaded successfully!",
      fileName: newFileName,
      originalName: uploadedFile.originalFilename,
      fileSize: formatSize(uploadedFile.size),
      fileType: mimeType,
      filePath: `/uploads/${newFileName}`,
      description: Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description || "",
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Handle formidable's max file size error specifically
    if (error.code === 1009 || (error.message && error.message.includes("maxFileSize"))) {
      return res.status(400).json({
        message: `File too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      });
    }

    return res.status(500).json({
      message: "Internal server error during upload.",
      error: error.message,
    });
  }
}