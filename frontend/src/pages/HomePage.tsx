import Navbar from "../components/NavBar";
import WorldMap from "../components/WorldMap";

export default function HomePage() {
  const storedUserString = localStorage.getItem("user");
  const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
  const firstName = storedUser.userName;
  return (
    <>
      <Navbar />
      <main>
        <h1 id='welcome'>Welcome,{firstName}!</h1>
        <WorldMap />
      </main>
    </>
  );
}
