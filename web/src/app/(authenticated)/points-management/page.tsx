'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import PointsTable from '../../../components/tables/PointsTable';
import AddPointsModal from '../../../components/modals/AddPointsModal';
import { 
  Customer,
  getCustomers, 
  addPointsToCustomer, 
  searchCustomers,
  initializeSampleData
} from '../../../lib/services/customerService';

export default function PointsManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [addPoints, setAddPoints] = useState('');
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      // Initialize sample data if the table is empty
      await initializeSampleData();
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
      toast.error('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (search.trim()) {
        try {
          setSearchLoading(true);
          const data = await searchCustomers(search.trim());
          setCustomers(data);
          setCurrentPage(1); // Reset to first page when searching
        } catch (error) {
          console.error('Failed to search customers:', error);
          toast.error('Failed to search customers. Please try again.');
        } finally {
          setSearchLoading(false);
        }
      } else {
        // If search is empty, reload all customers
        loadCustomers();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [search]);
  // Filter customers by search
  const filteredCustomers = customers;
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

  const handleAddPoints = async () => {
    if (!selectedCustomer || isNaN(Number(addPoints))) return;

    try {
      const pointsToAdd = Number(addPoints);
      toast.loading('Adding points...', { id: 'add-points' });
      
      const updatedCustomer = await addPointsToCustomer({
        id: selectedCustomer.id,
        pointsToAdd
      });

      // Update the customer in the local state
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id ? updatedCustomer : c
        )
      );

      toast.success(`Successfully added ${pointsToAdd} points to ${selectedCustomer.name}!`, {
        id: 'add-points'
      });
      closeModal();
    } catch (error) {
      console.error('Failed to add points:', error);
      toast.error('Failed to add points. Please try again.', {
        id: 'add-points'
      });
    }
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
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-blue-600">Loading customers...</div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
              disabled={searchLoading}
            />
            {searchLoading && (
              <div className="text-sm text-blue-600 mt-1">Searching...</div>
            )}
          </div>
          
          {customers.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              {search.trim() ? 'No customers found matching your search.' : 'No customers found.'}
            </div>
          ) : (
            <>
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
            </>
          )}
        </>
      )}
      
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
