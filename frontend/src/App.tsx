import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazyWithPreload } from "react-lazy-with-preload";
import usePostCountries from "./hooks/usePostCountries";

import "./styles/App.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const HomePage = lazyWithPreload(() => import("./pages/HomePage"));
const LogRegPage = lazyWithPreload(() => import("./pages/LogRegPage"));

HomePage.preload();
LogRegPage.preload();

export default function App() {
  usePostCountries();
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/home' element={<HomePage />} />
          <Route path='/' element={<LogRegPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}
