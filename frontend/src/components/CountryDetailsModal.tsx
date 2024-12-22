import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { Country } from "../types/interfaces";
import Carousel from "./Carousel";

interface CountryModalProps {
  show: boolean;
  countryName: string | null;
  onCancel: () => void;
  onUpdate: (userId: number) => void;
}

export default function CountryDetailsModal({
  show,
  countryName,
  onCancel,
  onUpdate,
}: CountryModalProps) {
  const [countryDetails, setCountryDetails] = useState<Country | null>(null);

  const fetchCountryDetails = useCallback(async () => {
    if (!countryName) return;
    try {
      const { data } = await axios.get<Country>(
        `/api/countries/${countryName}`
      );
      setCountryDetails(data);
    } catch (error) {
      console.error("Error fetching country details:", error);
    }
  }, [countryName]);

  useEffect(() => {
    fetchCountryDetails();
  }, [fetchCountryDetails]);

  const updateVisitStatus = async (statusId: number) => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser?.userId;

    if (!userId || !countryDetails) return;

    try {
      await axios.post("/api/travellist", {
        user_id: userId,
        country_id: countryDetails.country_id,
        status_id: statusId,
      });

      onUpdate(userId);
      onCancel();
    } catch (error) {
      console.error("Error updating visit status:", error);
    }
  };

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton className='d-flex align-items-center'>
        {countryDetails?.country_flag && (
          <img
            src={countryDetails.country_flag}
            alt='Flag'
            width={40}
            height={30}
            className='mx-2'
          />
        )}
        <Modal.Title>{countryName}</Modal.Title>
      </Modal.Header>

      <Modal.Body className='px-4'>
        {countryDetails ? (
          <div>
            <Carousel countryName={countryDetails.country_name} />
            {Object.entries({
              Description: countryDetails.country_description,
              Capital: countryDetails.country_capital,
              Population: countryDetails.country_population?.toLocaleString(),
              Continent: countryDetails.country_continent,
              Language: countryDetails.country_language,
              Currency: countryDetails.country_currency,
            }).map(([key, value]) => (
              <p key={key} className='mb-0'>
                <strong>{key}:</strong> {value || "Not Found"}
              </p>
            ))}
          </div>
        ) : (
          <p>No details available for this country.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ backgroundColor: "#3d3b8e", border: "none" }}
          onClick={() => updateVisitStatus(2)}>
          Visited
        </Button>
        <Button
          style={{ backgroundColor: "#e072a4", border: "none" }}
          onClick={() => updateVisitStatus(1)}>
          Want to Visit
        </Button>
        <Button variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
