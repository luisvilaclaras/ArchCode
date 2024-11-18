import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "ArchCode - IA para Arquitectura. Normativas CTE, RITE, Urbanismo.",
  description: "La IA definitiva para arquitectos. Acelera tus proyectos con la potencia de la IA para arquitectos y gana tiempo",
  icons: {
    icon: "images/lupa.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Envolvemos toda la aplicación con el AuthProvider para mantener el contexto de autenticación disponible en toda la app */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
