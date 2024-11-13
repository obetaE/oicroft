import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer/Footer"


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
  title: "Oicroft",
  description: "Farm-to-Table Excellence. Fresh, Local, Reliable. Order now and experience the convenience of quality food, delivered",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
          {children}
          <Footer />
      </body>
    </html>
  );
}
