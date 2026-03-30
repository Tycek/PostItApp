import Link from 'next/link';
import './layout.css';
import { AuthProvider } from './AuthContext';
import NavBar from './NavBar';

export const metadata = {
  title: 'TextApp',
  description: 'Share your text content with formatting and images',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <main className="container">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

