'use client';
import { useState } from 'react';
import AddStaffModal, {
  StaffForm,
} from '../../../../components/modals/AddStaffModal';
import { StaffTable, Staff } from '../../../../components/tables/StaffTable';

const now = new Date().toISOString();
const sampleStaff: Staff[] = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@email.com',
    phone: '09171234567',
    position: 'Manager',
    address: '123 Main St, City',
    createdAt: now,
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@email.com',
    phone: '09181234567',
    position: 'Barista',
    address: '456 Oak Ave, City',
    createdAt: now,
  },
  {
    id: 3,
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie@email.com',
    phone: '09191234567',
    position: 'Cashier',
    address: '789 Pine Rd, City',
    createdAt: now,
  },
  {
    id: 4,
    firstName: 'Diana',
    lastName: 'Prince',
    email: 'diana@email.com',
    phone: '09201234567',
    position: 'Kitchen Staff',
    address: '321 Maple St, City',
    createdAt: now,
  },
  {
    id: 5,
    firstName: 'Ethan',
    lastName: 'Hunt',
    email: 'ethan@email.com',
    phone: '09211234567',
    position: 'Supervisor',
    address: '654 Cedar Ave, City',
    createdAt: now,
  },
  {
    id: 6,
    firstName: 'Fiona',
    lastName: 'Glenanne',
    email: 'fiona@email.com',
    phone: '09221234567',
    position: 'Assistant Manager',
    address: '987 Birch Rd, City',
    createdAt: now,
  },
  {
    id: 7,
    firstName: 'George',
    lastName: 'Miller',
    email: 'george@email.com',
    phone: '09231234567',
    position: 'Server',
    address: '246 Spruce St, City',
    createdAt: now,
  },
  {
    id: 8,
    firstName: 'Hannah',
    lastName: 'Lee',
    email: 'hannah@email.com',
    phone: '09241234567',
    position: 'Cleaner',
    address: '135 Willow Ave, City',
    createdAt: now,
  },
  {
    id: 9,
    firstName: 'Ivan',
    lastName: 'Petrov',
    email: 'ivan@email.com',
    phone: '09251234567',
    position: 'Barista',
    address: '864 Aspen Rd, City',
    createdAt: now,
  },
  {
    id: 10,
    firstName: 'Julia',
    lastName: 'Roberts',
    email: 'julia@email.com',
    phone: '09261234567',
    position: 'Cashier',
    address: '753 Elm St, City',
    createdAt: now,
  },
  {
    id: 11,
    firstName: 'Kevin',
    lastName: 'Durant',
    email: 'kevin@email.com',
    phone: '09271234567',
    position: 'Manager',
    address: '159 Oak Ave, City',
    createdAt: now,
  },
  {
    id: 12,
    firstName: 'Linda',
    lastName: 'Carter',
    email: 'linda@email.com',
    phone: '09281234567',
    position: 'Kitchen Staff',
    address: '357 Pine Rd, City',
    createdAt: now,
  },
  {
    id: 13,
    firstName: 'Mike',
    lastName: 'Ross',
    email: 'mike@email.com',
    phone: '09291234567',
    position: 'Supervisor',
    address: '951 Maple St, City',
    createdAt: now,
  },
  {
    id: 14,
    firstName: 'Nina',
    lastName: 'Simone',
    email: 'nina@email.com',
    phone: '09301234567',
    position: 'Barista',
    address: '258 Cedar Ave, City',
    createdAt: now,
  },
  {
    id: 15,
    firstName: 'Oscar',
    lastName: 'Wilde',
    email: 'oscar@email.com',
    phone: '09311234567',
    position: 'Server',
    address: '654 Birch Rd, City',
    createdAt: now,
  },
  {
    id: 16,
    firstName: 'Paula',
    lastName: 'Abdul',
    email: 'paula@email.com',
    phone: '09321234567',
    position: 'Cleaner',
    address: '357 Spruce St, City',
    createdAt: now,
  },
  {
    id: 17,
    firstName: 'Quentin',
    lastName: 'Tarantino',
    email: 'quentin@email.com',
    phone: '09331234567',
    position: 'Cashier',
    address: '159 Willow Ave, City',
    createdAt: now,
  },
  {
    id: 18,
    firstName: 'Rachel',
    lastName: 'Green',
    email: 'rachel@email.com',
    phone: '09341234567',
    position: 'Manager',
    address: '753 Aspen Rd, City',
    createdAt: now,
  },
  {
    id: 19,
    firstName: 'Steve',
    lastName: 'Jobs',
    email: 'steve@email.com',
    phone: '09351234567',
    position: 'Barista',
    address: '951 Elm St, City',
    createdAt: now,
  },
  {
    id: 20,
    firstName: 'Tina',
    lastName: 'Turner',
    email: 'tina@email.com',
    phone: '09361234567',
    position: 'Kitchen Staff',
    address: '357 Oak Ave, City',
    createdAt: now,
  },
];

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>(sampleStaff);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<StaffForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    address: '',
  });

  const filteredStaff = staff.filter(
    (s) =>
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.toLowerCase().includes(search.toLowerCase()) ||
      s.position.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStaff = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.position
    )
      return;
    setStaff((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...form,
        createdAt: new Date().toISOString(),
      },
    ]);
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      address: '',
    });
    setShowModal(false);
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Staff Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Add Staff
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 w-full text-black bg-white"
        />
      </div>
      <div className="overflow-x-auto">
        <StaffTable items={filteredStaff} />
      </div>
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
