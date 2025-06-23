import ComingSoon from "@/CustomComponents/comingSoon/comingSoon";
import Footer from "@/CustomComponents/Footer/Footer";
import SettingsHeader from "@/CustomComponents/settingsHeader/settingsHeader";

export default function Styling() {
    return (
        <div className="flex flex-col justify-between h-screen bg-[#FAFAFA]">
            <div>
        <SettingsHeader title="Styling" />
        <ComingSoon image="/images/styling.png" />
        </div>
        <Footer />
        </div>
    )
}