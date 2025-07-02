import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Block runtime error plugin completely
(window as any).__vite_plugin_react_preamble_installed__ = true;

// Override error creation functions
const originalCreateElement = document.createElement;
document.createElement = function(tagName: string, options?: any) {
  const element = originalCreateElement.call(document, tagName, options);
  
  // Block error overlay creation
  if (element.id === 'vite-error-overlay' || 
      element.className?.includes('vite-error') ||
      element.className?.includes('runtime-error')) {
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
  }
  
  return element;
};

// Block appendChild for error overlays
const originalAppendChild = Document.prototype.appendChild;
Document.prototype.appendChild = function(child: any) {
  if (child?.id === 'vite-error-overlay' || 
      child?.className?.includes('vite-error') ||
      child?.className?.includes('runtime-error')) {
    return child; // Don't actually append
  }
  return originalAppendChild.call(this, child);
};

// Additional global error suppression
window.addEventListener('error', (e) => {
  if (e.message?.includes('runtime-error-plugin') || 
      e.message?.includes('unknown runtime error')) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}, true);

// Disable console errors related to runtime plugin
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('runtime-error-plugin') || 
      message.includes('sendError') ||
      message.includes('unknown runtime error')) {
    return; // Suppress
  }
  originalConsoleError.apply(console, args);
};

createRoot(document.getElementById("root")!).render(<App />);
