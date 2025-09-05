import './globals.css';

export const metadata = {
  title: 'Live Collab AI Editor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}