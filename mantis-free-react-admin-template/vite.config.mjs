import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/';
  const PORT = 3000;

  return {
    base: '/',
    server: {
      open: true,
      port: PORT,
      host: true
    },
    preview: {
      open: true,
      host: true,
      fs: {
        allow: ['..']
      }
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: {
        '@ant-design/icons': path.resolve(__dirname, 'node_modules/@ant-design/icons'),
        // THÊM ĐƯỜNG DẪN TẮT CHO CÁC THƯ MỤC TRONG SRC VÀO ĐÂY
        'assets': path.resolve(__dirname, 'src/assets'),
        'components': path.resolve(__dirname, 'src/components'),
        'pages': path.resolve(__dirname, 'src/pages'),
        'utils': path.resolve(__dirname, 'src/utils'),
        'contexts': path.resolve(__dirname, 'src/contexts'),
        'api': path.resolve(__dirname, 'src/api'),
        'store': path.resolve(__dirname, 'src/store'),
        'themes': path.resolve(__dirname, 'src/themes'),
        'layout': path.resolve(__dirname, 'src/layout'),
        'menu-items': path.resolve(__dirname, 'src/menu-items'),
        'routes': path.resolve(__dirname, 'src/routes')
      }
    },
    plugins: [react(), jsconfigPaths()],
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || '';
            const ext = name.split('.').pop();
            if (/\.css$/.test(name)) return `css/[name]-[hash].${ext}`;
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) return `images/[name]-[hash].${ext}`;
            if (/\.(woff2?|eot|ttf|otf)$/.test(name)) return `fonts/[name]-[hash].${ext}`;
            return `assets/[name]-[hash].${ext}`;
          }
        }
      },
      ...(mode === 'production' && {
        esbuild: {
          drop: ['console', 'debugger'],
          pure: ['console.log', 'console.info', 'console.debug', 'console.warn']
        }
      })
    },
    optimizeDeps: {
      include: ['@mui/material/Tooltip', 'react', 'react-dom', 'react-router-dom']
    }
  };
});