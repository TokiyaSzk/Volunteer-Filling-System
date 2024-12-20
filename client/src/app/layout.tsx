import type { Metadata } from "next";
import localFont from "next/font/local"
import Link from "next/link";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className="flex justify-center items-center w-full h-16 text-xl bg-gradient-to-r from-white to-gray-100 text-gray-800 space-x-10 py-4 font-bold shadow-md">
          <div className="w-16 h-12 flex items-center justify-center text-gray-800 hover:text-blue-700 transition-all duration-300 hover:scale-110">
            <Link href={'/'}>首页</Link>
          </div>
          <div className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent opacity-70"></div>
          <div className="w-16 h-12 flex items-center justify-center text-gray-800 hover:text-blue-700 transition-all duration-300 hover:scale-110">
            <Link href={'/user'}>用户</Link>
          </div>
          <div className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent opacity-70"></div>
          <div className="w-16 h-12 flex items-center justify-center text-gray-800 hover:text-blue-700 transition-all duration-300 hover:scale-110">
            <Link href={'/school'}>学校</Link>
          </div>
          <div className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent opacity-70"></div>
          <div className="w-16 h-12 flex items-center justify-center text-gray-800 hover:text-blue-700 transition-all duration-300 hover:scale-110">
            <Link href={'/major'}>专业</Link>
          </div>
        </div>
        {children}
        <div className="w-full h-12 ">
          <div className="flex justify-center items-center h-full text-white">
            © 2024 Volunteer Filling System. All rights reserved. 版权所有: <a href="https://github.com/TokiyaSzk">Tokiya(Wang Kuicheng)</a>
          </div>
        </div>
      </body>
    </html>
  );
}
