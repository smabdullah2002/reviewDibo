import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import "./globals.css";

export const metadata = {
  title: "Review Platform",
  description: "Product reviews and ratings",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 w-full mx-auto px-4 sm:px-6 py-4 sm:py-6" style={{ maxWidth: 1024 }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
