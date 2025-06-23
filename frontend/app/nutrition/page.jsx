import ComingSoon from "@/CustomComponents/comingSoon/comingSoon";
import Footer from "@/CustomComponents/Footer/Footer";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";

export default function Nutrition() {
    return (
        <div className="flex flex-col justify-between h-screen bg-[#FAFAFA]">
        <div>
        <SettingsHeader title="Nutrition" />
        <ComingSoon image="/images/nutrition.png"/>
        </div>
        <Footer/>
        </div>
    )
}