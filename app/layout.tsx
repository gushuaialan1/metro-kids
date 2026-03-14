import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <title>🚇 地铁小侦探 - 探索中国地铁</title>
        <meta name="description" content="儿童友好的中国地铁线路图探索网站" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
