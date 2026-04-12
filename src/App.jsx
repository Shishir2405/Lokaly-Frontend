import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home.jsx'));

function Booting() {
  return (
    <div className="min-h-screen grid place-items-center bg-cream">
      <div className="font-fraunces text-3xl text-ink animate-pulse">Lokaly</div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Booting />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Booting />} />
      </Routes>
    </Suspense>
  );
}
