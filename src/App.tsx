import { BrowserRouter, Route, Routes } from 'react-router'
import { About, FAQ, Services, Home } from '@/pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/FAQ" element={<FAQ />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
