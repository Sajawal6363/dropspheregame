// DropSphere Color Palette
export const Colors = {
  // Primary
  primary: "#6C5CE7",
  primaryDark: "#5B4BD4",

  // Secondary
  secondary: "#00D2FF",

  // Accent
  accent: "#FF3CAC",
  accentPink: "#FF6B9D",

  // Success/Danger
  success: "#00FFAB",
  danger: "#FF4D4D",
  warning: "#FFD93D",

  // Text
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.8)",
    muted: "rgba(255, 255, 255, 0.5)",
    dark: "#1A1A2E",
  },

  // Background
  background: {
    dark: "#0F2027",
    card: "rgba(255, 255, 255, 0.08)",
    cardHover: "rgba(255, 255, 255, 0.12)",
  },

  // Card
  card: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.1)",
  },

  // Glow effects
  glow: {
    purple: "rgba(108, 92, 231, 0.6)",
    blue: "rgba(0, 210, 255, 0.6)",
    pink: "rgba(255, 60, 172, 0.6)",
    green: "rgba(0, 255, 171, 0.6)",
    red: "rgba(255, 77, 77, 0.6)",
  },

  // Difficulty colors
  difficulty: {
    easy: "#00FFAB",
    medium: "#FFD93D",
    hard: "#FF6B6B",
    extreme: "#FF3CAC",
    locked: "#4A5568",
  },

  // Locked/Unlocked states
  locked: "#4A5568",
  unlocked: "#6C5CE7",
  completed: "#00FFAB",

  // Platform colors
  platform: {
    normal: "#6C5CE7",
    moving: "#00D2FF",
    trap: "#FF3CAC",
    finish: "#00FFAB",
  },
};

// Gradient definitions
export const Gradients = {
  // Main background
  background: ["#0F2027", "#203A43", "#2C5364"] as const,

  // Ball gradient
  ball: ["#6C5CE7", "#00D2FF"] as const,
  ballAlt: ["#FF3CAC", "#FF6B9D"] as const,

  // Button gradients
  primary: ["#6C5CE7", "#5B4BD4"] as const,
  secondary: ["#00D2FF", "#0099CC"] as const,
  success: ["#00FFAB", "#00CC89"] as const,
  danger: ["#FF4D4D", "#CC3D3D"] as const,

  // Card gradients
  card: ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"] as const,

  // Level difficulty gradients
  easy: ["#00FFAB", "#00CC89"] as const,
  medium: ["#FFD93D", "#FFA502"] as const,
  hard: ["#FF6B6B", "#EE5A24"] as const,
  extreme: ["#FF3CAC", "#C44569"] as const,
};

// Legacy export for compatibility
export default {
  light: {
    text: Colors.text.primary,
    background: Colors.background.dark,
    tint: Colors.primary,
    tabIconDefault: Colors.text.muted,
    tabIconSelected: Colors.primary,
  },
};
