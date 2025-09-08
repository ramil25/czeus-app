'use client';
import Link from 'next/link';
import {
  FaMoneyBill,
  FaTachometerAlt,
  FaUsers,
  FaTable,
  FaUserTie,
  FaUserFriends,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow border border-blue-100"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-700">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex w-64 bg-white shadow flex-col py-8 px-4 h-full min-h-screen sticky top-0">
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
          href="/customer-management"
          className="flex items-center gap-2 text-blue-700 font-semibold hover:underline"
        >
          <FaUserFriends className="text-xl" />
          Customers Managements
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
      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white shadow flex flex-col py-8 px-4 h-full min-h-screen animate-slide-in-left">
            <button
              className="self-end mb-4 text-blue-700"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-blue-700 font-semibold hover:underline" onClick={() => setMobileOpen(false)}>
                <FaTachometerAlt className="text-xl" /> Dashboard
              </Link>
              <Link href="/user-management" className="flex items-center gap-2 text-blue-700 font-semibold hover:underline" onClick={() => setMobileOpen(false)}>
                <FaUsers className="text-xl" /> User Managements
              </Link>
              <Link href="/customer-management" className="flex items-center gap-2 text-blue-700 font-semibold hover:underline" onClick={() => setMobileOpen(false)}>
                <FaUserFriends className="text-xl" /> Customers Managements
              </Link>
              <Link href="/points-management" className="flex items-center gap-2 text-blue-700 font-semibold hover:underline" onClick={() => setMobileOpen(false)}>
                <MdPointOfSale className="text-xl" /> Points Managements
              </Link>
              {/* POS Setup collapsible menu */}
              <button
                type="button"
                className="flex items-center gap-2 text-blue-700 font-semibold hover:underline focus:outline-none"
                onClick={() => setPosOpen((open) => !open)}
                aria-expanded={posOpen}
              >
                <MdSettings className="text-xl" /> POS Setup
                {posOpen ? (
                  <MdKeyboardArrowUp className="text-xl ml-auto" />
                ) : (
                  <MdKeyboardArrowDown className="text-xl ml-auto" />
                )}
              </button>
              {posOpen && (
                <div className="ml-7 flex flex-col gap-2 text-blue-600">
                  <Link href="/pos-setup/tables" className="flex items-center gap-2 font-bold hover:underline" onClick={() => setMobileOpen(false)}>
                    <FaTable className="text-lg" /> Tables
                  </Link>
                  <Link href="/pos-setup/categories" className="flex items-center gap-2 font-bold hover:underline" onClick={() => setMobileOpen(false)}>
                    <MdCategory className="text-lg" /> Categories
                  </Link>
                  <Link href="/pos-setup/sizes" className="flex items-center gap-2 font-bold hover:underline" onClick={() => setMobileOpen(false)}>
                    <MdFormatSize className="text-lg" /> Size
                  </Link>
                  <Link href="/pos-setup/discounts" className="flex items-center gap-2 font-bold hover:underline" onClick={() => setMobileOpen(false)}>
                    <MdDiscount className="text-lg" /> Discounts
                  </Link>
                  <Link href="/pos-setup/staffs" className="flex items-center gap-2 font-bold hover:underline" onClick={() => setMobileOpen(false)}>
                    <FaUserTie className="text-lg" /> Staffs
                  </Link>
                  <Link href="/pos-setup/products" className="flex items-center gap-2 font-bold hover:underline" onClick={() => setMobileOpen(false)}>
                    <MdInventory className="text-lg" /> Products
                  </Link>
                </div>
              )}
              <Link href="/sales" className="flex items-center gap-2 text-blue-700 font-semibold hover:underline" onClick={() => setMobileOpen(false)}>
                <FaMoneyBill className="text-xl" /> Sales
              </Link>
              <Link href="/inventory-management" className="flex items-center gap-2 text-blue-700 font-semibold hover:underline" onClick={() => setMobileOpen(false)}>
                <MdInventory className="text-xl" /> Inventory Management
              </Link>
            </nav>
          </div>
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
