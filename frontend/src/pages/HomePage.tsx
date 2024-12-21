import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import WorldMap from "../components/WorldMap";
import axios from "axios";
import TravelList from "../components/TravelList";
import Footer from "../components/Footer";

export default function HomePage() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = storedUser.userName;
  const userId = storedUser.userId;

  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [wantedCountries, setWantedCountries] = useState<string[]>([]);

  // Visited ve wanted countries
  const fetchVisitedAndWantedCountries = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/travellist/${userId}`);
      setVisitedCountries(data.visited || []);
      setWantedCountries(data.wanted || []);
    } catch (error) {
      console.error("Error fetching travel list:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchVisitedAndWantedCountries();
  }, [fetchVisitedAndWantedCountries]);

  // Radera land från TravelList
  const deleteCountry = async (
    countryName: string,
    listType: "visited" | "wanted"
  ) => {
    try {
      const response = await axios.delete(`/api/travellist`, {
        data: { country_name: countryName },
      });

      if (response.status === 204) {
        if (listType === "visited") {
          setVisitedCountries((prev) =>
            prev.filter((country) => country !== countryName)
          );
        } else if (listType === "wanted") {
          setWantedCountries((prev) =>
            prev.filter((country) => country !== countryName)
          );
        }
      }
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className='d-flex justify-content-evenly flex-wrap'>
          <div className='my-4 d-flex flex-column justify-content-evenly flex-wrap'>
            <h2 id='welcome' className='mt-4'>
              Welcome,{firstName}!
            </h2>
            <h5 className='mb-4'>
              You can click on a country on the map, learn and add it to your
              lists.
            </h5>
            <TravelList
              visitedCountries={visitedCountries}
              wantedCountries={wantedCountries}
              handleDeleteCountry={deleteCountry}
            />
          </div>
          <WorldMap
            visitedCountries={visitedCountries}
            wantedCountries={wantedCountries}
            fetchVisitedAndWantedCountries={fetchVisitedAndWantedCountries}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
