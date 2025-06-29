import dynamic from "next/dynamic";

const ConsultationChat = dynamic(() => import('@/CustomComponents/chat/chat'), {
  ssr: false,
});
export default function CheckIngredients() {
  return (
    <div>
      <ConsultationChat route="ingredient_checker" title="Check Ingredients" />
    </div>
  );
}
