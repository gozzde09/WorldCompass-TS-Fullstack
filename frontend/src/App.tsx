import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazyWithPreload } from "react-lazy-with-preload";

import "./styles/App.css";
import Footer from "./components/Footer";

const HomePage = lazyWithPreload(() => import("./pages/HomePage"));
const LogRegPage = lazyWithPreload(() => import("./pages/LogRegPage"));

HomePage.preload();
LogRegPage.preload();

export default function App() {
  return (
    <Router>
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
