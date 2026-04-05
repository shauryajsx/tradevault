import './globals.css';
import AuthProvider from '../components/AuthProvider';

export const metadata = {
  title: 'TradeVault - Trading Journal & Strategy Repository',
  description: 'Your strategies. Your journal. Your edge.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
