import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import { Country } from "../types/interfaces";

interface CountryModalProps {
  show: boolean;
  countryName: string | null;
  onCancel: () => void;
  onUpdate: () => void;
}
export default function CountryDetailsModal(props: CountryModalProps) {
  const { show, countryName, onCancel, onUpdate } = props;

  const [countryDetails, setCountryDetails] = useState<Country | null>(null);
  const [, setVisitedCountries] = useState<string[]>([]);
  const [, setWantedCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      if (countryName) {
        try {
          const response = await axios.get<Country>(
            `/api/countries/${countryName}`
          );
          setCountryDetails(response.data);
        } catch (error) {
          console.error("Error fetching country details:", error);
        }
      }
    };

    fetchCountryDetails();
  }, [countryName]);

  // Handle visited / want visit countries update
  const updateVisitStatus = async (statusId: number) => {
    try {
      const storedUserString = localStorage.getItem("user");
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      const userId = storedUser?.userId;

      if (!userId || !countryDetails) return;

      await axios.post("/api/travellist", {
        user_id: userId,
        country_id: countryDetails.country_id,
        status_id: statusId,
      });
      // Visited
      if (statusId === 2) {
        setVisitedCountries((prev) => [
          ...(prev || []),
          countryDetails.country_name,
        ]);
      } else if (statusId === 1) {
        setWantedCountries((prev) => [
          ...(prev || []),
          countryDetails.country_name,
        ]);
      }
      onUpdate();
      onCancel();
    } catch (error) {
      console.error("Error updating visit status:", error);
    }
  };

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{countryName}</Modal.Title>
        <img
          src={countryDetails?.country_flag}
          alt='Flag '
          width={30}
          height={20}
          className='mx-2'
        />
      </Modal.Header>
      <Modal.Body>
        {countryDetails ? (
          <div>
            <p>
              <strong>Country Description:</strong>{" "}
              {countryDetails.country_description || "Not Found"}
            </p>
            <p>
              <strong>Capital:</strong>{" "}
              {countryDetails.country_capital || "Not Found"}
            </p>
            <p>
              <strong>Population:</strong>{" "}
              {countryDetails.country_population?.toLocaleString() ||
                "Not Found"}
            </p>
            <p>
              <strong>Continent:</strong>{" "}
              {countryDetails.country_continent || "Not Found"}
            </p>
            <p>
              <strong>Language:</strong>{" "}
              {countryDetails.country_language || "Not Found"}
            </p>
            <p>
              <strong>Currency:</strong>{" "}
              {countryDetails.country_currency || "Not Found"}
            </p>
          </div>
        ) : (
          <p>No details available for this country.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='primary'
          onClick={() => {
            updateVisitStatus(2);
          }}>
          Visited
        </Button>
        <Button
          variant='primary'
          onClick={() => {
            updateVisitStatus(1);
          }}>
          Want to Visit
        </Button>
      </Modal.Footer>
      <div
        className='d-flex justify-content-end mx-3 my-2
      '>
        <Button variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
