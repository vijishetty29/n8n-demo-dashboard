import './globals.css';

export const metadata = {
  title: 'n8n Demo Dashboard',
  description: 'Demo app to trigger an n8n workflow and save request history.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
