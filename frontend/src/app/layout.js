// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { Libre_Franklin } from "next/font/google";
import { Judson } from "next/font/google";
import "./globals.css";
import { Web3Modal } from "@/connection";

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});
const judson = Judson({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-judson",
  weight: ["400", "700"],
});

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={libre_franklin.variable + " " + judson.variable}>
        <Web3Modal>{children}</Web3Modal>
      </body>
    </html>
  );
}
