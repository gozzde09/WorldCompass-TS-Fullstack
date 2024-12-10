import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazyWithPreload } from "react-lazy-with-preload";
import usePostCountries from "./hooks/usePostCountries";

import "./styles/App.css";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

const HomePage = lazyWithPreload(() => import("./pages/HomePage"));
const LoginRegPage = lazyWithPreload(() => import("./pages/LoginRegPage"));

HomePage.preload();
LoginRegPage.preload();

export default function App() {
  usePostCountries();
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/loginreg' element={<LoginRegPage />} />
          {/* Redirect unknown paths to HomePage */}
          {/* <Route path='*' element={<Navigate to='/' />} /> */}
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}
