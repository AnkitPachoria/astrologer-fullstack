// import './globals.css'; 
// import Header from '../components/Header'
// import Footer from '../components/Footer'
// import '../styles/custom.css';
// import { Philosopher } from 'next/font/google';


// const philosopher = Philosopher({
//   subsets: ['latin'],
//   weight: ['400', '700'], // adjust weights if needed
//   display: 'swap',
// });
// export const metadata = {
//   title: 'Astrologer Website',
//   description: 'Astrology services, kundli, vastu, tarot reading',
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="flex flex-col min-h-screen">
//         <Header />
//         <main className="flex-grow ">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   )
// } 


import './globals.css'; 
import LayoutWrapper from './LayoutWrapper';  // import the client wrapper here
// import '../styles/custom.css';
import { Philosopher } from 'next/font/google';

const philosopher = Philosopher({
  subsets: ['latin'],
  weight: ['400', '700'], 
  display: 'swap',
});

export const metadata = {
  title: 'Astrologer Website',
  description: 'Astrology services, kundli, vastu, tarot reading',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen ${philosopher.className}`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  ); 
}
