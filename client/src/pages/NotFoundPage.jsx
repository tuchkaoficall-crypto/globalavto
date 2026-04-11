import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — Страница не найдена | Global Auto</title>
      </Helmet>
      <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="font-heading text-[120px] leading-none text-brand-red opacity-20 select-none">404</div>
          <h1 className="font-heading text-3xl text-white uppercase tracking-wide -mt-4 mb-4">Страница не найдена</h1>
          <p className="text-white/40 mb-8 font-body">Возможно, она была удалена или вы перешли по неверной ссылке</p>
          <div className="flex gap-4 justify-center">
            <Link to="/" className="btn-primary px-8 py-3">На главную</Link>
            <a href="tel:+78142631218" className="btn-secondary px-8 py-3">Позвонить</a>
          </div>
        </motion.div>
      </div>
    </>
  )
}
