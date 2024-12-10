import Countries from "../components/Countries";
import usePostCountries from "../hooks/usePostCountries";

export default function HomePage() {
  usePostCountries();

  return (
    <>
      <h1>Countries</h1>
      <Countries />{" "}
    </>
  );
}
