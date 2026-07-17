export const mermaidThemes = {
  default: {
    theme: 'default',
    themeVariables: {
      primaryColor: '#3b82f6',
      primaryTextColor: '#fff',
      primaryBorderColor: '#1d4ed8',
      lineColor: '#6b7280',
      secondaryColor: '#e0e7ff',
      tertiaryColor: '#f3f4f6',
    }
  },
  dark: {
    theme: 'dark',
    themeVariables: {
      primaryColor: '#6366f1',
      primaryTextColor: '#fff',
      lineColor: '#9ca3af',
    }
  },
  forest: {
    theme: 'forest',
  },
  neutral: {
    theme: 'neutral',
  },
  base: {
    theme: 'base',
  }
} as const;

export type MermaidThemeKey = keyof typeof mermaidThemes;
