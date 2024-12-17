export default function TravelList({
  visitedCountries,
  wantedCountries,
  handleDeleteCountry,
}: {
  visitedCountries: string[];
  wantedCountries: string[];
  handleDeleteCountry: (
    countryName: string,
    listType: "visited" | "wanted"
  ) => void;
}) {
  return (
    <div className='d-flex'>
      <div className='mx-auto'>
        <h5>Visited Countries</h5>
        {visitedCountries.length > 0 ? (
          <ul>
            {visitedCountries.map((country, index) => (
              <li key={index}>
                {country}
                <button
                  className='btn btn-danger btn-sm mx-2'
                  onClick={() => handleDeleteCountry(country, "visited")}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No countries visited yet.</p>
        )}
      </div>

      <div className='mx-auto'>
        <h5>Wanted Countries</h5>
        {wantedCountries.length > 0 ? (
          <ul>
            {wantedCountries.map((country, index) => (
              <li key={index}>
                {country}
                <button
                  className='btn btn-danger btn-sm mx-2'
                  onClick={() => handleDeleteCountry(country, "wanted")}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No countries added to wishlist yet.</p>
        )}
      </div>
    </div>
  );
}
