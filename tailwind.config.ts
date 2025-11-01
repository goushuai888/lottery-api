import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Microsoft YaHei', '微软雅黑', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // 品牌主色 - 蓝色系
        primary: {
          DEFAULT: '#24a4d9',
          dark: '#18a7dc',
          light: '#6bc0e5',
          50: '#e6f7fc',
          100: '#cceff9',
          200: '#99dff3',
          300: '#66cfed',
          400: '#33bfe7',
          500: '#24a4d9',
          600: '#1d83ad',
          700: '#166282',
          800: '#0e4156',
          900: '#07212b',
        },
        
        // 辅助蓝色
        secondary: {
          DEFAULT: '#0093FF',
          dark: '#0065ff',
          light: '#008bff',
        },
        
        // 强调色 - 红色系
        danger: {
          DEFAULT: '#f61b21',
          dark: '#e81c1c',
          light: '#ef3e36',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#f61b21',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // 金色系 - 高级标识
        gold: {
          DEFAULT: '#C4A235',
          light: '#fe8726',
          50: '#fef9e7',
          100: '#fdf3cf',
          200: '#fbe79f',
          300: '#f9db6f',
          400: '#f7cf3f',
          500: '#C4A235',
          600: '#9d822a',
          700: '#76611f',
          800: '#4f4115',
          900: '#28200a',
        },
        
        // 背景色系统
        bg: {
          primary: '#f2f2f2',
          white: '#ffffff',
          light: '#f6f6f6',
          disabled: '#fbfbfb',
          header: '#1d2026',
          dark: '#293036',
          overlay: 'rgba(157, 157, 156, 0.9)',
        },
        
        // 文字色系统
        text: {
          primary: '#4a4a4a',
          dark: '#333333',
          secondary: '#4F4F4F',
          muted: '#888888',
          light: '#999999',
          disabled: '#b3b3b3',
          subtle: '#bebebe',
          faint: '#c4c4c4',
          dropdown: '#595959',
          input: '#787878',
          description: '#676767',
        },
        
        // 边框色系统
        border: {
          DEFAULT: '#e0e0e0',
          light: '#dddddd',
          dark: '#dedede',
          divider: '#e5e6e7',
          dashed: '#bbbbbb',
          accent: '#d5eaf2',
          separator: '#C7C7CC',
          list: '#cccdd1',
          logo: '#dce0e3',
        },
      },
      
      // 渐变背景
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #0065ff, #008bff)',
        'gradient-blue': 'linear-gradient(to right, #24a4d9, #18a7dc)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      
      // 阴影系统
      boxShadow: {
        'header': '0px 4px 16px 0px rgba(44, 50, 65, 0.08)',
        'float': '0 1px 2px rgba(0, 0, 0, 0.2)',
        'modal': '4px 4px 55px #888888',
        'card': '0.5px 1px 10px #dfdfdf',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      
      // 圆角系统
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '5px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '15px',
        '3xl': '20px',
      },
      
      // 动画
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'flip-in': 'flipIn 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flipIn: {
          '0%': { 
            opacity: '0',
            transform: 'perspective(400px) rotateX(-90deg)',
          },
          '40%': {
            transform: 'perspective(400px) rotateX(20deg)',
          },
          '60%': {
            opacity: '1',
            transform: 'perspective(400px) rotateX(-10deg)',
          },
          '80%': {
            transform: 'perspective(400px) rotateX(5deg)',
          },
          '100%': {
            opacity: '1',
            transform: 'perspective(400px) rotateX(0deg)',
          },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
export default config

