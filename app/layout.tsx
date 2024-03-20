import type { Metadata } from "next";
import { Inter, Orelega_One } from "next/font/google";
import "./globals.css";

const orelega_One = Orelega_One({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Barbershop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="bumblebee">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className={(inter.className, orelega_One.className)}>
        <main>{children}</main>
      </body>
    </html>
  );
}
