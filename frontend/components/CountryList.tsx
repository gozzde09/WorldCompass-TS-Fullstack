import { useEffect } from "react";
import axios from "axios";

// Define types for the Country and API responses
interface Country {
  country_name: string;
  country_description?: string;
  country_capital?: string;
  country_population?: number;
  country_continent?: string;
  country_language?: string;
  country_currency?: string;
}

// Type for the data structure returned from the Rest Countries API
interface RestCountry {
  name: { common: string };
  capital?: string[];
  population?: number;
  region?: string;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string } };
}

export default function CountryList() {
  useEffect(() => {
    async function getAllCountriesOnStart() {
      try {
        // Fetch the list of all countries
        const response = await axios.get<RestCountry[]>(
          "https://restcountries.com/v3.1/all"
        );
        const countryData = response.data;

        // Fetch the descriptions of countries from Wikipedia
        const countryDescriptions = await fetchAllCountryDescriptions(
          countryData
        );

        // Prepare the countries' data
        const countries: Country[] = countryData
          .map((currentCountryData, index: number) => {
            if (
              currentCountryData.capital &&
              Array.isArray(currentCountryData.capital) &&
              currentCountryData.capital.length > 0
            ) {
              return {
                country_name: currentCountryData.name.common,
                country_description: countryDescriptions[index],
                country_capital: currentCountryData.capital[0],
                country_population: currentCountryData.population,
                country_continent: currentCountryData.region,
                country_language: currentCountryData.languages
                  ? currentCountryData.languages[
                      Object.keys(currentCountryData.languages)[0]
                    ]
                  : "",
                country_currency: currentCountryData.currencies
                  ? currentCountryData.currencies[
                      Object.keys(currentCountryData.currencies)[0]
                    ].name
                  : "",
              };
            } else {
              return null;
            }
          })
          .filter((country) => country !== null);

        // Sort countries alphabetically
        countries.sort((a, b) => a.country_name.localeCompare(b.country_name));

        // Send the data to your backend
        await postCountriesToDatabase(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    getAllCountriesOnStart();
  }, []);

  // Function to fetch country descriptions from Wikipedia API
  async function fetchAllCountryDescriptions(countryData: RestCountry[]) {
    const descriptionPromises = countryData.map(async (currentCountryData) => {
      try {
        const descriptionResponse = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${currentCountryData.name.common}`
        );
        return descriptionResponse.data.extract;
      } catch (error) {
        console.error(
          `Error fetching description for ${currentCountryData.name.common}:`,
          error
        );
        return null;
      }
    });

    return Promise.all(descriptionPromises);
  }

  // Function to post the country data to the backend API
  async function postCountriesToDatabase(countries: Country[]) {
    try {
      for (const country of countries) {
        const payload = {
          country_name: country.country_name,
          country_description: country.country_description,
          country_capital: country.country_capital,
          country_population: country.country_population,
          country_continent: country.country_continent,
          country_language: country.country_language,
          country_currency: country.country_currency,
        };

        await axios.post("http://localhost:3000/api/countries", payload);
        // console.log(`Country ${country.country_name} added to database`);
      }
    } catch (error) {
      console.error("Error sending country data to the backend:", error);
    }
  }

  return <p>Test ladda</p>;
}
