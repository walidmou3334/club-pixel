export class ApiError extends Error {
  constructor(message: string, public status: number, public fields: Record<string, string> = {}) { super(message); }
}
const API_URL = import.meta.env.VITE_API_URL || '/api';
export async function apiDownload(path: string, filename: string): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event('pixel-session-expired'));
    const error = await response.json().catch(() => null);
    throw new ApiError(error?.message || 'Unable to export participants.', response.status);
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem('token');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/')) window.dispatchEvent(new Event('pixel-session-expired'));
    throw new ApiError(data?.message || (response.status === 403 ? 'This action is not available for your account.' : `Request failed (${response.status}).`), response.status, data?.errors || {});
  }
  return data as T;
}
export async function uploadImage(
    file: File
): Promise<{ url: string; publicId: string }> {
  const token = localStorage.getItem('token');
  const formData = new FormData();

  formData.append('file', file);

  const response = await fetch(`${API_URL}/admin/uploads/image`, {
    method: 'POST',
    headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
        data?.error || data?.message || 'Image upload failed',
        response.status
    );
  }

  return data;
}
