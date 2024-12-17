import { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from "leaflet";

import CountryDetailsModal from "./CountryDetailsModal";

export default function WorldMap() {
  const [modalShow, setModalShow] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [wantedCountries, setWantedCountries] = useState<string[]>([]);

  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const fetchVisitedAndWantedCountries = async () => {
    try {
      const storedUserString = localStorage.getItem("user");
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      const userId = storedUser?.userId;

      if (!userId) return;

      const response = await axios.get(`/api/travellist/${userId}`);
      setVisitedCountries(response.data.visited);
      setWantedCountries(response.data.wanted);
    } catch (error) {
      console.error("Error fetching travel list:", error);
    }
  };

  useEffect(() => {
    fetchVisitedAndWantedCountries();
  }, []);

  // Karta
  useEffect(() => {
    const mapInstance = L.map("map", {
      center: [0, 0],
      zoom: 1,
    });
    mapRef.current = mapInstance;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      mapInstance
    );

    const geoJsonURL =
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

    const fetchGeoJSON = async () => {
      try {
        const response = await axios.get(geoJsonURL);
        const countries = response.data;

        if (geoJsonLayerRef.current) {
          mapInstance.removeLayer(geoJsonLayerRef.current);
        }

        geoJsonLayerRef.current = L.geoJSON(countries, {
          style: (feature) => ({
            fillColor: getColorForCountry(feature?.properties.name),
            weight: 1,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
          }),
          onEachFeature: (feature, layer) => {
            layer.on("click", () =>
              handleCountryClick(feature.properties.name)
            );
            layer.bindPopup(feature.properties.name);
          },
        });

        geoJsonLayerRef.current.addTo(mapInstance);
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };

    fetchGeoJSON();

    const getColorForCountry = (countryName: string) => {
      if (visitedCountries.includes(countryName)) {
        return "pink";
      } else if (wantedCountries.includes(countryName)) {
        return "purple";
      }
      return "lightgray";
    };

    const handleCountryClick = (countryName: string) => {
      setSelectedCountry(countryName);
      setModalShow(true);
    };

    return () => {
      mapInstance.remove();
    };
  }, [visitedCountries, wantedCountries]);

  const handleCancel = () => {
    setModalShow(false);
  };

  return (
    <div className='d-flex'>
      <div
        id='map'
        style={{ height: "450px", width: "500px", margin: "0.5rem" }}
        className='mx-auto my-2'></div>
      <CountryDetailsModal
        show={modalShow}
        countryName={selectedCountry}
        onCancel={handleCancel}
        onUpdate={fetchVisitedAndWantedCountries}
      />
    </div>
  );
}
