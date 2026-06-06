import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import HowItWorks from '../components/HowItWorks'
import DemoFeed from '../components/DemoFeed'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

/**
 * Marketing landing page. Explains LUMA and funnels visitors into the app via
 * the "Let's get started" calls-to-action (which route to /standup).
 */
export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <HowItWorks />
      <DemoFeed />
      <CTA />
      <Footer />
    </>
  )
}
