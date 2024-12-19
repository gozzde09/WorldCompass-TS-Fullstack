import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";

import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";

import "@fontsource/montserrat";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/400-italic.css";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
