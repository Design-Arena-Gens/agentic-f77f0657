import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Somil's Personal AI Agent",
  description: 'A private, voice-controlled AI agent created by Somil for personal use',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-300 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
