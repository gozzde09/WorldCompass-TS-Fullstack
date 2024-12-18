import { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from "leaflet";

import CountryDetailsModal from "./CountryDetailsModal";

interface WorldMapProps {
  visitedCountries: string[];
  wantedCountries: string[];
  fetchVisitedAndWantedCountries: (userId: number) => void;
}

export default function WorldMap({
  visitedCountries,
  wantedCountries,
  fetchVisitedAndWantedCountries,
}: WorldMapProps) {
  const [modalShow, setModalShow] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Karta
  useEffect(() => {
    const mapInstance = L.map("map", {
      center: [0, 0],
      zoom: 2,
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
            color: "gray",
            dashArray: "3",
            fillOpacity: 0.7,
          }),
          onEachFeature: (feature, layer) => {
            layer.bindPopup(feature.properties.name);

            layer.on("mouseover", () => {
              layer.openPopup();
            });

            layer.on("click", () =>
              handleCountryClick(feature.properties.name)
            );
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
        return "#2d2a98";
      } else if (wantedCountries.includes(countryName)) {
        return "#e072a4";
      }
      return "#f9f9f9";
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
        style={{
          height: "450px",
          width: "500px",
          borderRadius: "10px",
          border: "1px solid #2d2a98 ",
        }}
        className='mx-auto my-4'></div>
      <CountryDetailsModal
        show={modalShow}
        countryName={selectedCountry}
        onCancel={handleCancel}
        onUpdate={fetchVisitedAndWantedCountries}
      />
    </div>
  );
}
