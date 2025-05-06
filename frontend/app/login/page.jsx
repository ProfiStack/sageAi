import Footer from "../../CustomComponents/home/Footer/Footer";
import Header from "../../CustomComponents/header/Header";
import Login from "../../CustomComponents/Login/Login";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-between h-screen">
      <Header />
      <Login />
      <Footer />
    </div>
  );
}
