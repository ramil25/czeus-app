'use client';
import Link from 'next/link';
import { FaMoneyBill, FaTachometerAlt, FaUsers } from 'react-icons/fa';
import { MdPointOfSale } from 'react-icons/md';
import { MdInventory } from 'react-icons/md';

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow flex flex-col py-8 px-4">
      <nav className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-blue-700 font-semibold hover:underline"
        >
          <FaTachometerAlt className="text-xl" />
          Dashboard
        </Link>
        <Link
          href="/user-management"
          className="flex items-center gap-2 text-blue-700 font-semibold hover:underline"
        >
          <FaUsers className="text-xl" />
          User Managements
        </Link>
        <Link
          href="/points-management"
          className="flex items-center gap-2 text-blue-700 font-semibold hover:underline"
        >
          <MdPointOfSale className="text-xl" />
          Points Managements
        </Link>
        <Link
          href="/sales"
          className="flex items-center gap-2 text-blue-700 font-semibold hover:underline"
        >
          <FaMoneyBill className="text-xl" />
          Sales
        </Link>
        <Link
          href="/inventory"
          className="flex items-center gap-2 text-blue-700 font-semibold hover:underline"
        >
          <MdInventory className="text-xl" />
          Inventory
        </Link>
      </nav>
    </aside>
  );
}
