/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        peach: '#FFD6BA',
        mint: '#C8F4DE',
        lavender: '#E4D4F4',
        butter: '#FFF3B0',
        cream: '#FFF8F0',
        coral: '#FF6B6B',
        tangerine: '#FFA94D',
        leaf: '#51CF66',
        ink: '#2B2438',
        mauve: '#6B5A82',
      },
      fontFamily: {
        fraunces: ['Fraunces', '"DM Serif Display"', 'serif'],
        serifdisplay: ['"DM Serif Display"', 'Fraunces', 'serif'],
        inter: ['Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
      },
      borderRadius: {
        xl2: '1.25rem',
        blob: '2rem 3rem 2.5rem 3rem / 3rem 2rem 3rem 2rem',
        squishy: '42% 58% 65% 35% / 45% 45% 55% 55%',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(43,36,56,0.15)',
        pop: '0 16px 40px -16px rgba(255,107,107,0.45)',
        glow: '0 0 40px rgba(228,212,244,0.8)',
        ring: '0 0 0 6px rgba(255,214,186,0.45)',
      },
      backgroundImage: {
        'pastel-gradient': 'linear-gradient(135deg, #FFD6BA 0%, #E4D4F4 50%, #C8F4DE 100%)',
        'coral-gradient': 'linear-gradient(135deg, #FF6B6B 0%, #FFA94D 100%)',
        'butter-gradient': 'linear-gradient(135deg, #FFF3B0 0%, #FFD6BA 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.9) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.1) rotate(15deg)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        wiggle: 'wiggle 2.5s ease-in-out infinite',
        bounceSoft: 'bounceSoft 2s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease-out both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
