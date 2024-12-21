import { ListGroup, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaRegTrashAlt } from "react-icons/fa";

type TravelListProps = {
  visitedCountries: string[];
  wantedCountries: string[];
  handleDeleteCountry: (
    countryName: string,
    listType: "visited" | "wanted"
  ) => void;
};

export default function TravelList({
  visitedCountries,
  wantedCountries,
  handleDeleteCountry,
}: TravelListProps) {
  const handleDelete = (country: string, listType: "visited" | "wanted") => {
    handleDeleteCountry(country, listType);
  };

  const tooltipDelete = (
    <Tooltip id='tooltip'>Remove this country from the list.</Tooltip>
  );

  const CountryList = ({
    title,
    countries,
    color,
    listType,
  }: {
    title: string;
    countries: string[];
    color: string;
    listType: "visited" | "wanted";
  }) => (
    <div className='mx-4 travel-list'>
      <h5 style={{ color }}>{title}</h5>
      {countries.length > 0 ? (
        <ListGroup>
          {countries.map((country, index) => (
            <ListGroup.Item
              key={index}
              className='d-flex justify-content-between align-items-center'>
              {country}
              <OverlayTrigger placement='top' overlay={tooltipDelete}>
                <span className='mx-2'>
                  <FaRegTrashAlt
                    onClick={() => handleDelete(country, listType)}
                    style={{ cursor: "pointer", color: "#ffd447" }}
                  />
                </span>
              </OverlayTrigger>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>
          No countries
          {listType === "visited" ? " visited yet" : " added to wishlist yet"}.
        </p>
      )}
    </div>
  );

  return (
    <Container className='d-flex justify-content-evenly flex-wrap'>
      <CountryList
        title='You have visited:'
        countries={visitedCountries}
        color='#3d3b8e'
        listType='visited'
      />
      <CountryList
        title='You want to visit:'
        countries={wantedCountries}
        color='#e072a4'
        listType='wanted'
      />
    </Container>
  );
}
