import { Outlet } from 'react-router-dom'
import './globals.css'

export default function RootLayout() {
  return (
    <html lang="fr"> {/* Changed lang to "fr" */}
      <body>
        <Outlet />
      </body>
    </html>
  )
}
