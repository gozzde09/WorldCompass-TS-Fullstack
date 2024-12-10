import { useEffect } from "react";
import axios from "axios";
import { Country } from "../types/interfaces";

interface RestCountry {
  name: { common: string };
  capital?: string[];
  population?: number;
  region?: string;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string } };
  flags?: { svg: string };
}

export default function usePostCountries() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const countryData = await getCountries();
        const descriptions = await getCountryDescriptions(countryData);
        const countries = processCountryData(countryData, descriptions);
        await postCountriesToDatabase(countries);
      } catch (error) {
        console.error("Error processing countries:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it only runs once when the component mounts

  //Hämta länder från RestCountries API
  const getCountries = async (): Promise<RestCountry[]> => {
    const url = "https://restcountries.com/v3.1/all";
    try {
      const { data } = await axios.get<RestCountry[]>(url);
      return data;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw new Error("Error fetching countries");
    }
  };

  // Hämta descriptions from Wikipedia API
  const getCountryDescriptions = async (countryData: RestCountry[]) => {
    const descriptionPromises = countryData.map(async (currentCountryData) => {
      try {
        const { data } = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${currentCountryData.name.common}`
        );
        return data.extract;
      } catch (error) {
        console.error(
          `Error fetching description for ${currentCountryData.name.common}:`,
          error
        );
        return null;
      }
    });
    return Promise.all(descriptionPromises);
  };

  // Ena datan för posting
  const processCountryData = (
    countryData: RestCountry[],
    descriptions: string[]
  ): Country[] => {
    return countryData
      .map((currentCountryData, index): Country | null => {
        if (
          currentCountryData.capital &&
          Array.isArray(currentCountryData.capital) &&
          currentCountryData.capital.length > 0
        ) {
          return {
            country_name: currentCountryData.name.common,
            country_description: descriptions[index] ?? "",
            country_capital: currentCountryData.capital[0],
            country_population: currentCountryData.population,
            country_continent: currentCountryData.region,
            country_language:
              currentCountryData.languages &&
              Object.values(currentCountryData.languages)[0],
            country_currency:
              currentCountryData.currencies &&
              Object.values(currentCountryData.currencies)[0]?.name,
            country_flag: currentCountryData.flags?.svg ?? "",
          };
        }
        return null;
      })
      .filter((country): country is Country => country !== null) // Ensuring the array is of type 'Country[]'
      .sort((a, b) => a.country_name.localeCompare(b.country_name)); // Sort alphabetically
  };

  // POST
  const postCountriesToDatabase = async (countries: Country[]) => {
    try {
      for (const country of countries) {
        await axios.post("/api/countries", country);
        // console.log(`Posted country: ${country.country_name}`);
      }
    } catch (error) {
      console.error("Error posting countries to the backend:", error);
    }
  };
}
