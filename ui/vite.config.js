import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BasePath= (process.env.GITHUB_REPOSITORY||'').replace(/^[^\/]*/,'') 

function manualChunks(id) {
	console.log("manualChunks",id);
	if (id.includes('node_modules')) {
		return (
			id.includes('prime') ? 'vendor-prime' :
			id.includes('mirror') ? 'vendor-mirror' :
			'vendor'
		)
	}
}

//SEE: https://vitejs.dev/config/
export default defineConfig({
	base: BasePath,
  plugins: [react()],
	build: {
		rollupOptions: { output: { manualChunks }},
	},
})
