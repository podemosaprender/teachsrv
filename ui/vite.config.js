import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BasePath= (process.env.GITHUB_REPOSITORY||'').replace(/^[^\/]*/,'') 

//SEE: https://vitejs.dev/config/
export default defineConfig({
	base: BasePath,
  plugins: [react()],
})
