import { BrowserRouter, Route, Routes } from 'react-router'
import { About, Admin, FAQ, Services, Home, Client, Partner } from '@/pages'
import {
  AdminClient,
  AdminCreate,
  AdminPartner,
  AdminServices,
  AdminServicesType,
} from '@/components'
import { PrivateRoute } from '@/contexts/PrivateRoute'
import OutrosServicosPage from './components/admin/OutrosServicosPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route path="parceiros" element={<AdminPartner />} />
          <Route path="clientes" element={<AdminClient />} />
          <Route path="servicos" element={<AdminServices />} />
          <Route path="tipos" element={<AdminServicesType />} />
          <Route path="criar-admin" element={<AdminCreate />} />
          <Route path="outros-servicos" element={<OutrosServicosPage />} />
        </Route>
        <Route
          path="/cliente"
          element={
            <PrivateRoute allowedRoles={['client']}>
              <Client />
            </PrivateRoute>
          }
        />
        <Route
          path="/parceiro"
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
