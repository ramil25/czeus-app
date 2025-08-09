'use client';
import Link from 'next/link';
import {
  FaMoneyBill,
  FaTachometerAlt,
  FaUsers,
  FaTable,
  FaUserTie,
} from 'react-icons/fa';
import {
  MdPointOfSale,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdCategory,
  MdDiscount,
  MdFormatSize,
} from 'react-icons/md';
import { MdInventory, MdSettings } from 'react-icons/md';
import { useState } from 'react';

export function Sidebar() {
  const [posOpen, setPosOpen] = useState(false);
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
        {/* POS Setup collapsible menu */}
        <button
          type="button"
          className="flex items-center gap-2 text-blue-700 font-semibold hover:underline focus:outline-none"
          onClick={() => setPosOpen((open) => !open)}
          aria-expanded={posOpen}
        >
          <MdSettings className="text-xl" />
          POS Setup
          {posOpen ? (
            <MdKeyboardArrowUp className="text-xl ml-auto" />
          ) : (
            <MdKeyboardArrowDown className="text-xl ml-auto" />
          )}
        </button>
        {posOpen && (
          <div className="ml-7 flex flex-col gap-2 text-blue-600">
            <Link
              href="/pos-setup/tables"
              className="flex items-center gap-2 font-bold hover:underline"
            >
              <FaTable className="text-lg" /> Tables
            </Link>
            <Link
              href="/pos-setup/categories"
              className="flex items-center gap-2 font-bold hover:underline"
            >
              <MdCategory className="text-lg" /> Categories
            </Link>
            <Link
              href="/pos-setup/sizes"
              className="flex items-center gap-2 font-bold hover:underline"
            >
              <MdFormatSize className="text-lg" /> Size
            </Link>
            <Link
              href="/pos-setup/discounts"
              className="flex items-center gap-2 font-bold hover:underline"
            >
              <MdDiscount className="text-lg" /> Discounts
            </Link>
            <Link
              href="/pos-setup/staffs"
              className="flex items-center gap-2 font-bold hover:underline"
            >
              <FaUserTie className="text-lg" /> Staffs
            </Link>
            <Link
              href="/pos-setup/products"
              className="flex items-center gap-2 font-bold hover:underline"
            >
              <MdInventory className="text-lg" /> Products
            </Link>
          </div>
        )}
        <Link
          href="/sales"
          className="flex items-center gap-2 text-blue-700 font-semibold hover:underline"
        >
          <FaMoneyBill className="text-xl" />
          Sales
        </Link>
        <Link
          href="/inventory-management"
          className="flex items-center gap-2 text-blue-700 font-semibold hover:underline"
        >
          <MdInventory className="text-xl" />
          Inventory Management
        </Link>
      </nav>
    </aside>
  );
}
