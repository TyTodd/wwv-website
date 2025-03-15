import fs from "fs/promises"; // Use promises for async/await

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer(); // Convert File object to ArrayBuffer
  return Buffer.from(buffer).toString("base64"); // Convert buffer to Base64
}

export async function uploadFile(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const response = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Upload failed:", result);
      return null;
    }

    return result.data.url; // URL where the file is hosted
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

export async function uploadFileToAirtable(
  file: File,
  recordId: string,
  fieldId: string
) {
  // Read the file and convert it to a Base64 string
  const base64String = await fileToBase64(file);

  // Construct the API request body
  const requestBody = {
    contentType: file.type, // e.g. "application/pdf"
    file: base64String, // Base64 encoded file content
    filename: file.name, // Original filename
  };

  // Airtable API endpoint for direct file upload
  const url = `https://content.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${recordId}/${fieldId}/uploadAttachment`;

  // Make the request to Airtable
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  // Parse response
  const result = await response.json();
  if (!response.ok) {
    console.error("Airtable Attachment Upload Failed:", result);
    throw new Error(result.error?.message || "Failed to upload attachment");
  }

  return response; // This will contain the uploaded file details
}
