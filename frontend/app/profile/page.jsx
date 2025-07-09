import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import dynamic from "next/dynamic";

const ProfilePageContent = dynamic(
  () => import("@/CustomComponents/profile/ProfilePageContent"),
  { ssr: false }
);

export default function ProfilePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
