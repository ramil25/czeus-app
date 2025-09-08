'use client';
import { useState, useEffect } from 'react';
import AddCustomerModal, {
  CustomerForm,
} from '../../../components/modals/AddCustomerModal';
import EditCustomerModal, {
  EditCustomerForm,
} from '../../../components/modals/EditCustomerModal';
import ConfirmationModal from '../../../components/modals/ConfirmationModal';
import { CustomerTable } from '../../../components/tables/CustomerTable';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, Customer, CustomerFormData } from '../../../lib/customers';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [editForm, setEditForm] = useState<EditCustomerForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  // Load customer data on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const customerData = await getCustomers();
      setCustomers(customerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCustomer = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone
    )
      return;
    
    try {
      setLoading(true);
      setError(null);
      
      const customerData: CustomerFormData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };
      
      await createCustomer(customerData);
      
      // Reset form and close modal
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
      });
      setShowModal(false);
      
      // Reload customer list
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add customer');
      console.error('Error adding customer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = async (customer: Customer) => {
    setEditingCustomer(customer);
    setEditForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setShowEditModal(true);
  };

  const handleSaveEditCustomer = async (editFormData: EditCustomerForm) => {
    if (!editingCustomer) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const customerData: CustomerFormData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,
      };
      
      await updateCustomer(editingCustomer.id, customerData);
      
      // Reset form and close modal
      setEditForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
      });
      setShowEditModal(false);
      setEditingCustomer(null);
      
      // Reload customer list
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
      console.error('Error updating customer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingCustomer(null);
    setEditForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const handleRemoveCustomer = async (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      try {
        setLoading(true);
        setError(null);
        await deleteCustomer(customerToDelete.id);
        await loadCustomers(); // Reload the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove customer');
        console.error('Error removing customer:', err);
      } finally {
        setLoading(false);
      }
    }
    setShowConfirmModal(false);
    setCustomerToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setCustomerToDelete(null);
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Customer Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          Add Customer
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded text-red-700">
          {error}
          <button 
            className="ml-2 text-red-900 hover:text-red-600"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
          disabled={loading}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-blue-600">Loading customers...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <CustomerTable 
            items={filteredCustomers} 
            onEdit={handleEditCustomer}
            onRemove={handleRemoveCustomer}
          />
        </div>
      )}
      
      <AddCustomerModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => setShowModal(false)}
        onAdd={handleAddCustomer}
      />
      
      <EditCustomerModal
        open={showEditModal}
        customer={editingCustomer}
        form={editForm}
        setForm={setEditForm}
        onCancel={handleCancelEdit}
        onSave={handleSaveEditCustomer}
        isLoading={loading}
      />
      
      <ConfirmationModal
        open={showConfirmModal}
        title="Remove Customer"
        message={`Are you sure you want to remove ${customerToDelete?.firstName} ${customerToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={loading}
        variant="danger"
      />
    </div>
  );
}