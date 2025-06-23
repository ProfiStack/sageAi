import ComingSoon from "@/CustomComponents/comingSoon/comingSoon";
import Footer from "@/CustomComponents/Footer/Footer";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";

export default function HairCare() {
    return (
        <div className="flex flex-col justify-between h-screen bg-[#FAFAFA] ">
            <div>
        <SettingsHeader title="Hair Care" />
        <ComingSoon image="/images/haircare.png" />
        </div>
        <Footer />
        </div>
    )
}