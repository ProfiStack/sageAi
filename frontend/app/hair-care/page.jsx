import ComingSoon from "@/CustomComponents/comingSoon/comingSoon";
import Footer from "@/CustomComponents/Footer/Footer";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";

export default function HairCare() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="flex flex-col justify-between h-screen bg-[#FAFAFA] ">
        <div>
          <SettingsHeader title="Hair Care" />
          <ComingSoon image="/images/haircare.png" />
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
