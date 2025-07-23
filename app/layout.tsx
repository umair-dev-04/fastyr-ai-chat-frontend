import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ErrorBoundary } from "@/components/ui/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Assistant - Your Intelligent Chat Companion",
  description:
    "Get instant answers, solve problems, and boost productivity with our advanced AI assistant. From questions to calculations, writing help, and more.",
  keywords: "AI assistant, chatbot, artificial intelligence, questions, calculations, writing help, productivity",
  authors: [{ name: "AI Assistant Team" }],
  openGraph: {
    title: "AI Assistant - Your Intelligent Chat Companion",
    description: "Get instant answers and help with anything using our advanced AI assistant",
    type: "website",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
