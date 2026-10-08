import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Tables from './pages/Tables';
import KOT from './pages/KOT';
import KDS from './pages/KDS';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import Vendors from './pages/Vendors';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/kot" element={<KOT />} />
        <Route path="/kds" element={<KDS />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
