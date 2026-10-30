import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Sammex Imports | China to Ghana", description: "Shop ready-stock products, place pre-orders and source products from China with Sammex Imports." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }