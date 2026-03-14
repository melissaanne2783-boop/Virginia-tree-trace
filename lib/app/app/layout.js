import './globals.css'

export const metadata = {
  title: 'Virginia Tree Trace',
  description: 'Mapping trees in the Commonwealth',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}