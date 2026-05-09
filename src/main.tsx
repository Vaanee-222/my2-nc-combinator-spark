import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import HeadScriptsInjector from './components/HeadScriptsInjector.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HeadScriptsInjector />
    <App />
  </ErrorBoundary>
);
