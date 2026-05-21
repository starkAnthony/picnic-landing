import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Packages from './components/Packages'
import Gallery from './components/Gallery'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import Booking from './components/Booking'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Packages />
        <Gallery />
        <HowItWorks />
        <Testimonials />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
