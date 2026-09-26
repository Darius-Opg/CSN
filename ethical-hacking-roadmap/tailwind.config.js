/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0B1014',
          panel: '#121A22',
          raised: '#1A232C',
          line: '#263140',
        },
        ink: {
          DEFAULT: '#E7EDF2',
          muted: '#8FA0AF',
          faint: '#5C6B78',
        },
        status: {
          done: '#5FBE8B',
          progress: '#E3A64A',
          next: '#6E92C4',
          flag: '#DC6B62',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
}
