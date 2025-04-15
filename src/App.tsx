import { BrowserRouter, Route, Routes } from 'react-router'
import { About, Admin, FAQ, Services, Home, Client, Partner } from '@/pages'
import { AdminClient, AdminPartner, AdminServices } from '@/components'
import { PrivateRoute } from '@/contexts/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route path="funcionarios" element={<AdminPartner />} />
          <Route path="clientes" element={<AdminClient />} />
          <Route path="servicos" element={<AdminServices />} />
        </Route>
        <Route
          path="/client"
          element={
            <PrivateRoute allowedRoles={['client']}>
              <Client />
            </PrivateRoute>
          }
        />
        <Route
          path="/partner"
          element={
            <PrivateRoute allowedRoles={['partner']}>
              <Partner />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
