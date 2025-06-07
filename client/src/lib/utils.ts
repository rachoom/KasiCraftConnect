import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatRating(rating: string | number): string {
  const num = typeof rating === "string" ? parseFloat(rating) : rating;
  return num.toFixed(1);
}

export function getServiceIcon(service: string): string {
  const icons: Record<string, string> = {
    builders: "fas fa-hammer",
    plumbers: "fas fa-wrench",
    electricians: "fas fa-bolt",
    carpenters: "fas fa-saw-blade",
    tilers: "fas fa-th-large",
    cleaners: "fas fa-broom",
    landscapers: "fas fa-seedling",
  };
  return icons[service] || "fas fa-tools";
}

export function calculateDistance(loc1: string, loc2: string): number {
  // Simple mock distance calculation based on city matching
  // In a real app, this would use proper geolocation APIs
  const city1 = loc1.split(",")[0].toLowerCase().trim();
  const city2 = loc2.split(",")[0].toLowerCase().trim();
  
  if (city1 === city2) return 0;
  
  // Mock distances for demo
  const distances: Record<string, Record<string, number>> = {
    "johannesburg": { "pretoria": 50, "cape town": 1400, "durban": 560 },
    "cape town": { "stellenbosch": 50, "johannesburg": 1400, "durban": 1650 },
    "durban": { "johannesburg": 560, "cape town": 1650, "port elizabeth": 600 },
  };
  
  return distances[city1]?.[city2] || Math.floor(Math.random() * 500) + 50;
}
