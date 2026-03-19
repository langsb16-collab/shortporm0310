/**
 * API Service for AI Shorts Factory
 * Optimized for Cloudflare Workers + R2
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.aishorts.factory";

export const apiService = {
  /**
   * Health check for the Edge Worker
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error("Worker health check failed:", error);
      return { status: "offline" };
    }
  },

  /**
   * Trigger AI Generation via Worker
   */
  async generateVideo(keyword: string, category: string) {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, category }),
    });
    return await response.json();
  },

  /**
   * Upload video to Cloudflare R2 via Worker
   */
  async uploadToR2(file: File, name: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  },

  /**
   * Get public URL for R2 asset
   */
  getR2Url(fileName: string) {
    const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "https://pub-r2.aishorts.factory";
    return `${R2_PUBLIC_URL}/${fileName}`;
  }
};
