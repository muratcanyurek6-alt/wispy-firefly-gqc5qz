import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bu ayar, CodeSandbox veya herhangi bir host üzerindeki
    // önizleme engellemesini kaldırır.
    allowedHosts: true,
    host: true, // Sunucunun dışarıdan erişilebilir olmasını sağlar
  },
});
