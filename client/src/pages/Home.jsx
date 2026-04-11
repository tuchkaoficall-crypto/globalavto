import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Services from '../components/Services'
import CarSelector from '../components/CarSelector'
import Portfolio from '../components/Portfolio'
import Reviews from '../components/Reviews'
import Contacts from '../components/Contacts'
import Footer from '../components/Footer'
import RequestPopup from '../components/RequestPopup'

import FloatContact from '../components/FloatContact'

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <>
      <Helmet>
        <title>Global Auto — Кузовной ремонт в Петрозаводске</title>
        <meta name="description" content="Профессиональный кузовной ремонт в Петрозаводске. Рихтовка, покраска, ремонт кузова. Шуйское Шоссе 20Б. Тел: +7 (8142) 63-12-18" />
        <meta property="og:title" content="Global Auto — Кузовной ремонт в Петрозаводске" />
        <meta property="og:description" content="Профессиональный кузовной ремонт. Рихтовка, покраска, ремонт кузова." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoRepair",
          "name": "Global Auto",
          "description": "Профессиональный кузовной ремонт в Петрозаводске. Рихтовка, покраска, ремонт после ДТП.",
          "url": "https://globalavto.ru",
          "telephone": "+78142631218",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Шуйское Шоссе, 20Б",
            "addressLocality": "Петрозаводск",
            "addressRegion": "Республика Карелия",
            "addressCountry": "RU"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 61.7849,
            "longitude": 34.3469
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
              "opens": "10:00",
              "closes": "19:00"
            }
          ],
          "priceRange": "$$",
          "image": "https://globalavto.ru/assets/LOGO4.png"
        })}</script>
      </Helmet>

      <Navbar onRequestClick={() => setPopupOpen(true)} />
      <Hero onRequestClick={() => setPopupOpen(true)} />
      <Stats />
      <Services onRequestClick={() => setPopupOpen(true)} />
      <CarSelector />
      <Portfolio />
      <Reviews />
      <Contacts />
      <Footer />

      <RequestPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
      <FloatContact />
    </>
  )
}
