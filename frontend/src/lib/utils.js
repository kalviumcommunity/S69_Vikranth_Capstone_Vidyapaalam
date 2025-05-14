import { clsx } from "clsx";

export function cn(...inputs) {
  return inputs.reduce((acc, input) => {
    if (typeof input === 'string') {
      return `${acc} ${input}`.trim();
    } else if (typeof input === 'object' && input !== null) {
      if (Array.isArray(input)) {
        return `${acc} ${input.filter(Boolean).join(' ')}`.trim();
      } else {
        return `${acc} ${clsx(input)}`.trim();
      }
    }
    return acc;
  }, '');
}

// Add a toast utility function that can be used throughout the app
export function showToast(message, type = "info") {
  // Create toast element
  const toast = document.createElement("div");
  
  // Set classes based on type
  const baseClasses = "fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white z-50";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };
  
  toast.className = `${baseClasses} ${typeClasses[type]} animate-fade-in`;
  toast.textContent = message;
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Remove after delay
  setTimeout(() => {
    toast.classList.remove("animate-fade-in");
    toast.classList.add("animate-fade-out");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}