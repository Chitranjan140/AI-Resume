import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider as SimpleAuthProvider } from '@/lib/simple-auth'
import { AuthProvider as FirebaseAuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/lib/theme-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Resume Analyzer - Smart Job Matching Platform',
  description: 'Analyze your resume with AI, get job match scores, and improve your career prospects',
  keywords: 'resume analyzer, AI resume, job matching, ATS optimization, career development',
  authors: [{ name: 'AI Resume Analyzer' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'AI Resume Analyzer - Smart Job Matching Platform',
    description: 'Analyze your resume with AI, get job match scores, and improve your career prospects',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <FirebaseAuthProvider>
            <SimpleAuthProvider>
              {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                },
              }}
            />
          </SimpleAuthProvider>
        </FirebaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}