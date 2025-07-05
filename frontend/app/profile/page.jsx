import dynamic from "next/dynamic";

const ProfilePageContent = dynamic(
  () => import("@/CustomComponents/profile/ProfilePageContent"),
  { ssr: false }
);

export default function ProfilePage() {
  return <ProfilePageContent />;
}
