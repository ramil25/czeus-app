'use client';
import { useState, useEffect } from 'react';
import AddStaffModal, {
  StaffForm,
} from '../../../../components/modals/AddStaffModal';
import { StaffTable } from '../../../../components/tables/StaffTable';
import { getStaff, createStaff, deleteStaff, Staff, StaffFormData } from '../../../../lib/staff';

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<StaffForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    address: '',
  });

  // Load staff data on component mount
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const staffData = await getStaff();
      setStaff(staffData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff');
      console.error('Error loading staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.toLowerCase().includes(search.toLowerCase()) ||
      s.position.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStaff = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.position
    )
      return;
    
    try {
      setLoading(true);
      setError(null);
      
      const staffData: StaffFormData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        position: form.position,
        address: form.address,
      };
      
      await createStaff(staffData);
      
      // Reset form and close modal
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        address: '',
      });
      setShowModal(false);
      
      // Reload staff list
      await loadStaff();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add staff');
      console.error('Error adding staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStaff = async (staffMember: Staff) => {
    // For now, we'll implement this later if needed
    console.log('Edit staff:', staffMember);
  };

  const handleRemoveStaff = async (staffMember: Staff) => {
    if (!confirm(`Are you sure you want to remove ${staffMember.firstName} ${staffMember.lastName}?`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await deleteStaff(staffMember.id);
      await loadStaff(); // Reload the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove staff');
      console.error('Error removing staff:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Staff Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          Add Staff
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
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
          disabled={loading}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-blue-600">Loading staff...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <StaffTable 
            items={filteredStaff} 
            onEdit={handleEditStaff}
            onRemove={handleRemoveStaff}
          />
        </div>
      )}
      
      <AddStaffModal
        open={showModal}
        form={form}
        setForm={setForm}
        onCancel={() => setShowModal(false)}
        onAdd={handleAddStaff}
      />
    </div>
  );
}
