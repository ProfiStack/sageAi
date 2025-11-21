import { Camera, X, AlertCircle, Settings } from "lucide-react";

export default function CameraPermissionModal({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <Camera size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Camera Access Blocked</h2>
            <p className="text-blue-100 text-sm">
              We need camera permission to continue
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle
              className="text-amber-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div className="text-sm text-amber-900">
              <p className="font-medium mb-1">Permission Required</p>
              <p className="text-amber-800">
                Sagee AI needs access to your camera to provide visual
                assistance and analysis.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Settings size={18} className="text-gray-600" />
              How to enable camera access:
            </h3>

            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">
                  1
                </span>
                <span>
                  Click the camera icon or lock icon in your browser's address
                  bar
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">
                  2
                </span>
                <span>Find "Camera" in the permissions list</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">
                  3
                </span>
                <span>Change the setting to "Allow" for sageeai.com</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">
                  4
                </span>
                <span>Refresh this page to apply the changes</span>
              </li>
            </ol>
          </div>

          {/* Actions */}

          <p className="text-xs text-gray-500 text-center mt-4">
            Your privacy is important. Camera access is only used while you're
            actively using the feature.
          </p>
        </div>
      </div>
    </div>
  );
}
