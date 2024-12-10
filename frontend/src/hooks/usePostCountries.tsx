import { useEffect } from "react";
import axios from "axios";

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
    async function getAndSendCountries() {
      if (localStorage.getItem("countriesPosted")) {
        console.log("Countries and descriptions already posted.");
        return []; // Prevent fetching and posting countries again
      }
      try {
        const url = "https://restcountries.com/v3.1/all";
        const response = await axios.get<RestCountry[]>(url);
        const countryData = response.data;

        const descriptions = await getCountryDescriptions(countryData);

        // Prepare and sort data
        const countries = response.data.map((currentCountryData, index) => ({
          country_name: currentCountryData.name.common,
          country_description: descriptions[index],
          country_capital: currentCountryData.capital?.[0],
          country_population: currentCountryData.population,
          country_continent: currentCountryData.region,
          country_language:
            currentCountryData.languages &&
            Object.values(currentCountryData.languages)[0],
          country_currency:
            currentCountryData.currencies &&
            Object.values(currentCountryData.currencies)[0]?.name,
          country_flag: currentCountryData.flags?.svg ?? "",
        }));

        for (const country of countries) {
          await axios.post("/api/countries", country);
          // console.log(`Posted country: ${country.country_name}`);
          localStorage.setItem("countriesPosted", "true");
        }
      } catch (error) {
        console.error("Error posting countries to the backend:", error);
      }
    }

    getAndSendCountries();
  }, []);
}

async function getCountryDescriptions(countryData: RestCountry[]) {
  const descriptionPromises = countryData.map(async (currentCountryData) => {
    try {
      const descriptionResponse = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${currentCountryData.name.common}`
      );

      return descriptionResponse.data.extract;
    } catch {
      return null;
    }
  });

  return Promise.all(descriptionPromises);
}
