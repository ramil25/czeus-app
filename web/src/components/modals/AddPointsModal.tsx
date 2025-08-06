import React from 'react';

interface AddPointsModalProps {
  open: boolean;
  customer: { id: number; name: string } | null;
  addPoints: string;
  setAddPoints: (val: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const AddPointsModal: React.FC<AddPointsModalProps> = ({
  open,
  customer,
  addPoints,
  setAddPoints,
  onCancel,
  onAdd,
}) => {
  if (!open || !customer) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Add Points for {customer.name}
        </h2>
        <input
          type="number"
          min="1"
          className="w-full border border-blue-200 px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
          placeholder="Enter points to add"
          value={addPoints}
          onChange={(e) => setAddPoints(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-white border border-blue-200 text-black rounded hover:bg-blue-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm"
            onClick={onAdd}
            disabled={
              !addPoints ||
              isNaN(Number(addPoints)) ||
              Number(addPoints) <= 0
            }
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPointsModal;
