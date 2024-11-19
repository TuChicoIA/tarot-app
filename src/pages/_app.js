// src/pages/_app.js
import '../styles/globals.css'  // AQUÍ es donde debe estar la importación
import { Inter } from 'next/font/google'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
