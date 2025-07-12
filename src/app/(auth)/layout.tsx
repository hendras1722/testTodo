import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login Web',
}

export default function RootLayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body cz-shortcut-listen="true">
        <div>{children}</div>
      </body>
    </html>
  )
}
