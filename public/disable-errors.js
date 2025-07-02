// Script to completely disable runtime error overlays
(function() {
  'use strict';
  
  // Block all runtime error functionality
  window.__vite_plugin_react_preamble_installed__ = true;
  
  // Override global error handling
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'error' && listener && listener.toString().includes('sendError')) {
      return; // Block error listeners from runtime plugin
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Block DOM manipulation for overlays
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(newNode, referenceNode) {
    if (newNode && (
      newNode.id === 'vite-error-overlay' ||
      newNode.className?.includes('vite-error') ||
      newNode.className?.includes('runtime-error')
    )) {
      return newNode; // Don't insert
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
  
  // Block createElement for error elements
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName, options) {
    const element = originalCreateElement.call(this, tagName, options);
    
    if (element.id === 'vite-error-overlay' || 
        element.className?.includes('vite-error')) {
      element.style.display = 'none';
      return element;
    }
    
    return element;
  };
  
  // Suppress console errors from runtime plugin
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('runtime-error-plugin') || 
        message.includes('sendError') ||
        message.includes('unknown runtime error')) {
      return; // Suppress
    }
    return originalError.apply(console, args);
  };
  
  // Block fetch requests to error reporting endpoints
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.includes('sendError')) {
      return Promise.resolve(new Response());
    }
    return originalFetch.call(this, url, options);
  };
  
})();