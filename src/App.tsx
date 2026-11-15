import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import Preloader from './components/layout/Preloader'
import Cta from './components/sections/Cta'
import Journey from './components/sections/Journey'
import Pillars from './components/sections/Pillars'
import Properties from './components/sections/Properties'
import SearchBar from './components/sections/SearchBar'
import Welcome from './components/sections/Welcome'
import HeroCanvasFrames from './components/hero/HeroCanvasFrames'
import { useLenis } from './hooks/useLenis'

export default function App() {
  useLenis()

  return (
    <div id="top">
      <Preloader />
      <Navbar />
      <HeroCanvasFrames />
      <main className="relative z-10">
        <Journey />
        <div className="relative bg-ivory">
          <SearchBar />
          <Welcome />
          <Properties />
          <Pillars />
          <Cta />
        </div>
      </main>
      <Footer />
    </div>
  )
}
