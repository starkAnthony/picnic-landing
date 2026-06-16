import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Packages from '../components/Packages'
import Gallery from '../components/Gallery'
import InstagramFeed from '../components/InstagramFeed'
import NewsEvents from '../components/NewsEvents'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Booking from '../components/Booking'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Packages />
        <NewsEvents />
        <Gallery />
        <InstagramFeed />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
