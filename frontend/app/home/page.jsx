import ProtectedRoute from "@/CustomComponents/ProtectedRoute";
import dynamic from "next/dynamic";
const HomePage = dynamic(() => import("@/CustomComponents/home/Home"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <ProtectedRoute requireAuth={true}>
        <HomePage />
      </ProtectedRoute>
    </>
  );
}
