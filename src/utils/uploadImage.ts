export default async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${import.meta.env.VITE_API_URL}/media/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!response.ok) throw new Error("Upload failed");
  return await response.json();
}
    