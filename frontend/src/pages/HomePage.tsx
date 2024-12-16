import Countries from "../components/Countries";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";

export default function HomePage() {
  const storedUserString = localStorage.getItem("user");
  const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
  const firstName = storedUser.userName;
  return (
    <main>
      <Navbar />
      <h1>Countries</h1>
      <h1 id='welcome'>Welcome back,{firstName}!</h1>
      <Countries /> <Footer />
    </main>
  );
}
