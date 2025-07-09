import ComingSoon from "@/CustomComponents/comingSoon/comingSoon";
import Footer from "@/CustomComponents/Footer/Footer";
import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";

export default function FindProviders() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div>
        <div className="flex flex-col justify-between h-screen bg-[#FAFAFA]">
          <div>
            <SettingsHeader title="Find Providers" />
            <ComingSoon image="/images/findProvider.png" />
          </div>
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
