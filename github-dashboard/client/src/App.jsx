import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Search from './pages/Search.jsx';
import Details from './pages/Details.jsx';
import Saved from './pages/Saved.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/repo/:owner/:repo" element={<Details />} />
          <Route path="/saved" element={<Saved />} />
          <Route
            path="*"
            element={
              <p className="text-muted">
                Page not found. <Link className="text-brand underline" to="/">Back to search</Link>
              </p>
            }
          />
        </Routes>
      </main>
    </>
  );
}
