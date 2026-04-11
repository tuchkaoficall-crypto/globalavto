import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BrandPage from './pages/BrandPage'
import RemontAvtoPage from './pages/RemontAvtoPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/remont-avto" element={<RemontAvtoPage />} />
        <Route path="/remont/:slug" element={<BrandPage />} />
        <Route path="/ga-dashboard" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
