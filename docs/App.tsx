import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DocsLayout from './layouts/DocsLayout';
import GettingStarted from './pages/GettingStarted';
import ToastComponentPage from './pages/components/ToastComponentPage';
import ApiReference from './pages/ApiReference';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/docs" element={<DocsLayout />}>
        <Route index element={<GettingStarted />} />
        <Route path="getting-started" element={<GettingStarted />} />
        <Route path="components/toast" element={<ToastComponentPage />} />
        <Route path="api" element={<ApiReference />} />
      </Route>
    </Routes>
  );
}
