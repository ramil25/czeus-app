'use client';
import { useState } from 'react';

import PointsTable from '../../../components/tables/PointsTable';
import AddPointsModal from '../../../components/modals/AddPointsModal';

interface Customer {
  id: number;
  name: string;
  email: string;
  points: number;
}

const mockCustomers: Customer[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@email.com', points: 120 },
  { id: 2, name: 'Bob Smith', email: 'bob@email.com', points: 85 },
  { id: 3, name: 'Charlie Brown', email: 'charlie@email.com', points: 200 },
  { id: 4, name: 'Diana Prince', email: 'diana@email.com', points: 150 },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@email.com', points: 95 },
  { id: 6, name: 'Fiona Glenanne', email: 'fiona@email.com', points: 180 },
  { id: 7, name: 'George Miller', email: 'george@email.com', points: 60 },
  { id: 8, name: 'Hannah Lee', email: 'hannah@email.com', points: 210 },
  { id: 9, name: 'Ivan Petrov', email: 'ivan@email.com', points: 75 },
  { id: 10, name: 'Julia Roberts', email: 'julia@email.com', points: 130 },
  { id: 11, name: 'Kevin Durant', email: 'kevin@email.com', points: 110 },
  { id: 12, name: 'Linda Carter', email: 'linda@email.com', points: 170 },
  { id: 13, name: 'Mike Ross', email: 'mike@email.com', points: 140 },
  { id: 14, name: 'Nina Simone', email: 'nina@email.com', points: 155 },
  { id: 15, name: 'Oscar Wilde', email: 'oscar@email.com', points: 90 },
];

export default function PointsManagement() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [addPoints, setAddPoints] = useState('');
  const [search, setSearch] = useState('');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  // Filter customers by search
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setAddPoints('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
    setAddPoints('');
  };

  const handleAddPoints = () => {
    if (!selectedCustomer || isNaN(Number(addPoints))) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === selectedCustomer.id
          ? { ...c, points: c.points + Number(addPoints) }
          : c
      )
    );
    closeModal();
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Points Management
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>
      <div className="overflow-x-auto">
        <PointsTable customers={paginatedCustomers} onAddPoints={openModal} />
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-black">
          Showing {(currentPage - 1) * pageSize + 1} -{' '}
          {Math.min(currentPage * pageSize, customers.length)} of{' '}
          {customers.length}
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-100'
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <AddPointsModal
        open={modalOpen}
        customer={selectedCustomer}
        addPoints={addPoints}
        setAddPoints={setAddPoints}
        onCancel={closeModal}
        onAdd={handleAddPoints}
      />
    </div>
  );
}
