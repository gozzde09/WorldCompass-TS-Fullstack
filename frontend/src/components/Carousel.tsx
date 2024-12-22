import React, { useEffect, useState } from "react";
import { Carousel, Spinner } from "react-bootstrap";

interface CountryCarouselProps {
  countryName: string;
}
interface UnsplashImage {
  urls: {
    regular: string;
  };
}

const CountryCarousel: React.FC<CountryCarouselProps> = ({ countryName }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${countryName}`,
          {
            headers: {
              Authorization:
                "Client-ID YXkvGz4I8Jzxgr9QCjb3uCZC7y4_wyYabGwGEtXUJJg",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const data = await response.json();
        const imageUrls = data.results
          .slice(0, 5)
          .map((result: UnsplashImage) => result.urls.regular);
        setImageUrls(imageUrls);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    if (countryName) {
      fetchImages();
    }
  }, [countryName]);

  return (
    <>
      {loading ? (
        <div className='text-center my-3'>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
          <p>Loading images...</p>
        </div>
      ) : (
        <Carousel className='mb-3'>
          {imageUrls.map((url, index) => (
            <Carousel.Item key={index} style={{ maxHeight: 300 }}>
              <img
                src={url}
                alt={`Image of ${countryName} ${index + 1}`}
                style={{ width: "100%", height: "auto", maxHeight: 300 }}
              />
              <Carousel.Caption>
                <h3>{`${index + 1}`}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default CountryCarousel;
