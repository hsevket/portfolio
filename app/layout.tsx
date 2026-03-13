import "./globals.css";

export const metadata = {
  title: "Hamdi Sevketbeyoglu | D365 Developer",
  description: "Dynamics 365 developer portfolio — articles, projects, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}