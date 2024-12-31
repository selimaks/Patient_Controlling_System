import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'background': '#fdfefe',
                'background-secondary': '#e2d4da',
                'background-tertiary': '#d3ccd3',
                'background-quaternary': '#ddc3cd',
                'background-quinary': '#d8afbd',
                'text-primary': '#1d1216',
                'text-secondary': '#344358',
                'button-primary': '#d95b46',
                'button-secondary': '#f8b87c',

                'dark-background': '#11123b',
                'dark-background-secondary': '#353753',
                'dark-background-tertiary': '#3d3f5c',
                'dark-background-quaternary': '#4b4c6a',
                'dark-background-quinary': '#565981',
                'dark-text-primary': '#f9f9e1',
                'dark-text-secondary': '#e27225',
                'dark-button-primary': '#9bcddc',
                'dark-button-secondary': '#46abc1',
            },
        },
    },

    plugins: [forms],
};
