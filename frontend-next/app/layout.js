import './globals.css';
import Navbar from '../components/Navbar';
import localFont from 'next/font/local';

const liAdorNoirrit = localFont({
  src: [
    {
      path: '../public/fonts/li-ador-noirrit/Li-Ador-Noirrit-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/li-ador-noirrit/Li-Ador-Noirrit-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/li-ador-noirrit/Li-Ador-Noirrit-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/li-ador-noirrit/Li-Ador-Noirrit-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/li-ador-noirrit/Li-Ador-Noirrit-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-li-ador',
  display: 'swap',
});

const solaimanLipi = localFont({
  src: [
    {
      path: '../public/fonts/SolaimanLipi.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-solaiman',
  display: 'swap',
});

const liSubha = localFont({
  src: [
    {
      path: '../public/fonts/Li Subha Letterpress Unicode.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Li Subha Letterpress Unicode Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-li-subha',
  display: 'swap',
});

const hindSiliguri = localFont({
  src: [
    {
      path: '../public/fonts/Hind_Siliguri/HindSiliguri-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Hind_Siliguri/HindSiliguri-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Hind_Siliguri/HindSiliguri-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Hind_Siliguri/HindSiliguri-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Hind_Siliguri/HindSiliguri-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-hind',
  display: 'swap',
});

export const metadata = {
  title: 'Titas | Dhaka University',
  description: 'Dhaka University Brahmanbaria District Student Welfare Association',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${liAdorNoirrit.variable} ${solaimanLipi.variable} ${liSubha.variable} ${hindSiliguri.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bn-text">
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
