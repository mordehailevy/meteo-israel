import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import History from './pages/history';
import About from './pages/About';
import WeatherBackground from './components/WeatherBackground';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <WeatherBackground />
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>&#127758; Weather Israel</h1>
            <p>Check the current weather by city in Israel</p>
          </div>
          <nav className="main-nav">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/history">Search History</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2025 Mordehai Levy · Weather Israel</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
