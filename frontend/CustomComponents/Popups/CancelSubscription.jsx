import { Api } from "@/shared/api/api";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function CancelSubscriptionPopup({ isOpen, setIsOpen }) {
  const { token, setIsSubscribed } = useAuthStore();
  const router = useRouter();
  const handleLogout = async () => {
    await Api.client.getCancelSubscription(token);
    setIsSubscribed(false); // Update the auth store
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[10px] p-6 max-w-sm w-full mx-4 shadow-xl ">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Cancel Subscription
          </h3>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel subscription? You'll need to subscribe
          again to access Premium Features.
        </p>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-[8px] font-medium  transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-[8px] font-medium transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
