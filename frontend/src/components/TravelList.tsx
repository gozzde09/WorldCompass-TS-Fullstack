import { ListGroup, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaRegTrashAlt } from "react-icons/fa";

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
  const tooltipDelete = (
    <Tooltip id='tooltip'>Delete the country from the list.</Tooltip>
  );

  return (
    <Container className='d-flex justify-content-evenly'>
      <div className='mx-4'>
        <h5 style={{ color: "#3d3b8e" }}>You have visited:</h5>
        {visitedCountries.length > 0 ? (
          <ListGroup>
            {visitedCountries.map((country, index) => (
              <ListGroup.Item
                key={index}
                className='d-flex justify-content-between align-items-center'>
                {country}
                <OverlayTrigger placement='top' overlay={tooltipDelete}>
                  <span className='mx-2'>
                    <FaRegTrashAlt
                      onClick={() => handleDeleteCountry(country, "visited")}
                      style={{ cursor: "pointer", color: "#ffd447" }}
                    />
                  </span>
                </OverlayTrigger>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No countries visited yet.</p>
        )}
      </div>

      <div>
        <h5 style={{ color: " #e072a4" }}>You want visit:</h5>
        {wantedCountries.length > 0 ? (
          <ListGroup>
            {wantedCountries.map((country, index) => (
              <ListGroup.Item
                key={index}
                className='d-flex justify-content-between align-items-center'>
                {country}
                <OverlayTrigger placement='top' overlay={tooltipDelete}>
                  <span className='mx-2'>
                    <FaRegTrashAlt
                      onClick={() => handleDeleteCountry(country, "wanted")}
                      style={{ cursor: "pointer", color: "#ffd447" }}
                    />
                  </span>
                </OverlayTrigger>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No countries added to wishlist yet.</p>
        )}
      </div>
    </Container>
  );
}
