import Countries from "../components/Countries";
import Navbar from "../components/NavBar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <h1>Countries</h1>
      <Countries />{" "}
    </main>
  );
}
