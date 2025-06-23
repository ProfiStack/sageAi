import ComingSoon from "@/CustomComponents/comingSoon/comingSoon";
import Footer from "@/CustomComponents/Footer/Footer";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";

export default function Wellness() {
    return (
        <div className="flex flex-col justify-between h-screen bg-[#FAFAFA]">
            <div>
        <SettingsHeader title="Wellness" />
        <ComingSoon image="/images/wellness.png" />
        </div>
        <Footer />
        </div>
    )
}