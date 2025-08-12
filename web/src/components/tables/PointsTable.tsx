import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { Customer } from '../../lib/services/customerService';

interface PointsTableProps {
  customers: Customer[];
  onAddPoints: (customer: Customer) => void;
}

const PointsTable: React.FC<PointsTableProps> = ({
  customers,
  onAddPoints,
}) => {
  return (
    <table className="min-w-full bg-white border border-blue-200 rounded shadow">
      <thead className="bg-blue-100">
        <tr>
          <th className="py-2 px-4 border-b border-blue-200 text-black">
            Name
          </th>
          <th className="py-2 px-4 border-b border-blue-200 text-black">
            Email
          </th>
          <th className="py-2 px-4 border-b border-blue-200 text-black">
            Points
          </th>
          <th className="py-2 px-4 border-b border-blue-200 text-black">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id} className="hover:bg-blue-50">
            <td className="py-2 px-4 border-b border-blue-100 text-black">
              {customer.name}
            </td>
            <td className="py-2 px-4 border-b border-blue-100 text-black">
              {customer.email}
            </td>
            <td className="py-2 px-4 border-b border-blue-100 text-center text-black font-semibold">
              {customer.points}
            </td>
            <td className="py-2 px-4 border-b border-blue-100 text-center">
              <button
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm"
                onClick={() => onAddPoints(customer)}
              >
                <FaPlus /> Add Points
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PointsTable;
