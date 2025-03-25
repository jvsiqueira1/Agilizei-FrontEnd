import { BrowserRouter, Route, Routes } from 'react-router'
import { About, Client, FAQ, Partner, Services, Home } from './pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/client" element={<Client />} />
        <Route path="/partner" element={<Partner />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
