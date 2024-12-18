import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import WorldMap from "../components/WorldMap";
import axios from "axios";
import TravelList from "../components/TravelList";
import Footer from "../components/Footer";

export default function HomePage() {
  const storedUserString = localStorage.getItem("user");
  const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
  const firstName = storedUser.userName;
  const userId = storedUser.userId;
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [wantedCountries, setWantedCountries] = useState<string[]>([]);

  // Visited ve wanted countries
  const fetchVisitedAndWantedCountries = async (userId: number) => {
    try {
      const response = await axios.get(`/api/travellist/${userId}`);
      setVisitedCountries(response.data.visited || []);
      setWantedCountries(response.data.wanted || []);
    } catch (error) {
      console.error("Error fetching travel list:", error);
    }
  };
  useEffect(() => {
    fetchVisitedAndWantedCountries(userId);
  }, [userId]);

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
        <div className='d-flex justify-content-evenly'>
          <WorldMap
            visitedCountries={visitedCountries}
            wantedCountries={wantedCountries}
            fetchVisitedAndWantedCountries={fetchVisitedAndWantedCountries}
          />{" "}
          <div className='my-4'>
            <h2 id='welcome' className='mt-2'>
              Welcome,{firstName}!
            </h2>
            <TravelList
              visitedCountries={visitedCountries}
              wantedCountries={wantedCountries}
              handleDeleteCountry={deleteCountry}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
