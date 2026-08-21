/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Marcellus', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        sanskrit: ['Tiro Devanagari Sanskrit', 'Marcellus', 'serif'],
        kannada: ['Tiro Kannada', 'Noto Sans Kannada', 'Marcellus', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Brand (existing)
        saffron: {
          DEFAULT: '#D84315',
          light: '#FF8A65',
          dark: '#BF360C',
        },
        marigold: '#F9A826',
        cotton: '#FAFAF5',
        ink: '#2C241B',
        muted2: '#5C5449',
        warmBorder: '#E5DFD3',
        // Karnataka ethnic palette (Sprint 1.5)
        chandana: {
          DEFAULT: '#EFE0BF',    // sandalwood cream — Mysore gopura sand
          light: '#F7EED8',
          dark: '#D9C596',
        },
        kumkuma: {
          DEFAULT: '#B0212B',    // deep temple vermilion (Karnataka kumkuma)
          dark: '#8B1B22',
        },
        mysoreGold: {
          DEFAULT: '#B98A2E',    // Mysore silk zari thread gold
          light: '#D9A94B',
          dark: '#8A6621',
        },
        banana: {
          DEFAULT: '#6D8B44',    // banana leaf green (south Indian ritual)
          dark: '#4F6A2E',
        },
        hoysala: {
          DEFAULT: '#5B4A38',    // Halebidu/Belur stone brown
          dark: '#3C2F22',
        },
        kavi: '#8B3A2B',          // laterite terracotta (coastal Karnataka)
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'slow-drift': { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.4s ease-out both',
        'slow-drift': 'slow-drift 6s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
