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

export function showToast(message, type = "info") {
  const toast = document.createElement("div");
  
  const baseClasses = "fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white z-50";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };
  
  toast.className = `${baseClasses} ${typeClasses[type]} animate-fade-in`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove("animate-fade-in");
    toast.classList.add("animate-fade-out");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}