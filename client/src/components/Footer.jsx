import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#080808] border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/assets/LOGO4.png" alt="Global Auto" className="h-8 w-auto object-contain" />
            <span className="font-heading text-lg text-white tracking-widest">GLOBAL AUTO</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/40">
            <span>Петрозаводск, Шуйское Шоссе 20Б</span>
            <a href="tel:631218" className="hover:text-white transition-colors">+7 (8142) 63-12-18</a>
            <a href="https://vk.link/globalauto_ptz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ВКонтакте</a>
            <a href="https://t.me/globalauto_ptz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
          </div>

          <p className="text-white/20 text-sm">© {year} Global Avto</p>
        </div>

        {/* SEO links */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-x-4 gap-y-2 justify-center">
          <Link to="/remont-avto" className="text-white/20 hover:text-white/50 text-xs transition-colors">
            Кузовной ремонт в Петрозаводске
          </Link>
          <Link to="/uslugi-i-tseny" className="text-white/20 hover:text-white/50 text-xs transition-colors">
            Цены на кузовной ремонт
          </Link>
          {['toyota', 'bmw', 'mercedes', 'kia', 'hyundai', 'geely', 'lada'].map(slug => (
            <Link key={slug} to={`/remont/${slug}`} className="text-white/20 hover:text-white/50 text-xs transition-colors capitalize">
              Ремонт {slug}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
