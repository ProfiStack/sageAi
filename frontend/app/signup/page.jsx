import Footer from "../CustomComponents/Footer/Footer";
import Header from "../CustomComponents/header/Header";
import SubSignup from "../CustomComponents/subSignUp/SubSignup";

export default function Signup() {
  return (
    <div className="flex flex-col justify-between h-screen container mx-auto">
      <Header />
      <SubSignup sub={false} />
      <Footer />
    </div>
  );
}
