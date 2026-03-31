/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                primary: '#e60000',
                secondary: '#ffcccc',
                accent: '#ffffff',
            },
            borderRadius: {
                product: '2.5rem',
            }
        },
    },
    plugins: [],
}
