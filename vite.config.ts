import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        // Main test harness entry point
        main: path.resolve(__dirname, 'index.html'),
        // Embeddable widget entry point for WordPress
        widget: path.resolve(__dirname, 'src/widget-embed.tsx'),
      },
      output: {
        // Separate chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'widgets': [
            './src/app/components/FillInBlanksWidget',
            './src/app/components/VerbConjugationWidget',
            './src/app/components/ExtendedResponseWidget',
            './src/app/components/OralPracticeWidget',
            './src/app/components/CorrectParagraphWidget',
            './src/app/components/FillInBlanksAIWidget',
            './src/app/components/AICompositionWidget',
            './src/app/components/AIChatWidgetResponsive',
            './src/app/components/DropdownWidget',
            './src/app/components/TableWidget',
            './src/app/components/VerbIdentificationWidget',
            './src/app/components/DrawingVocabularyWidget',
          ],
        },
      },
    },
  },
})