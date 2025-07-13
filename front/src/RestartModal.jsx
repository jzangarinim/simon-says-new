export default function RestartModal({ onClose, onRestart }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-slate-900/75" aria-hidden="true" />

      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold">Restart Game</h3>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to restart the game? Current progress will be
          lost.
        </p>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
            onClick={onRestart}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
