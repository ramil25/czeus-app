'use client';
import { useState } from 'react';

const productCategories = ['Beverages', 'Snacks', 'Meals'];
const products = [
  { name: 'Coke', size: 'Small', category: 'Beverages' },
  { name: 'Coke', size: 'Large', category: 'Beverages' },
  { name: 'Burger', size: 'Regular', category: 'Meals' },
  { name: 'Burger', size: 'Large', category: 'Meals' },
  { name: 'Chips', size: 'Pack', category: 'Snacks' },
];
const tables = ['Table 1', 'Table 2', 'Table 3', 'Table 4'];
const discounts = ['None', '10% Off', '20% Off', 'Employee Discount'];
const staffs = [
  'Alice Johnson',
  'Bob Brown',
  'Carol White',
  'David Black',
  'Eve Green',
  'Frank Blue',
];

type CartItem = {
  name: string;
  price: number;
  originalPrice: number;
  discountAmount: number;
  discountLabel: string;
  quantity: number;
};
export default function POSPage() {
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [table, setTable] = useState('');
  const [discount, setDiscount] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;
  const [staffSearch, setStaffSearch] = useState('');
  const filteredStaffs = staffSearch
    ? staffs.filter((s) => s.toLowerCase().includes(staffSearch.toLowerCase()))
    : staffs;

  // Dummy add to cart for demo
  const handleAddToCart = () => {
    if (product && quantity > 0) {
      // Simulate original price
      const originalPrice = 100 + cart.length * 10;
      let discountAmount = 0;
      let discountLabel = discount;
      if (discount === '10% Off') discountAmount = originalPrice * 0.1;
      else if (discount === '20% Off') discountAmount = originalPrice * 0.2;
      else if (discount === 'Employee Discount')
        discountAmount = originalPrice * 0.3;
      else discountLabel = 'None';
      setCart((prev) => [
        ...prev,
        {
          name: product,
          price: (originalPrice - discountAmount) * quantity,
          originalPrice: originalPrice * quantity,
          discountAmount: discountAmount * quantity,
          discountLabel,
          quantity,
        },
      ]);
    }
  };

  const totalOriginal = cart.reduce((sum, item) => sum + item.originalPrice, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discountAmount, 0);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row gap-6 p-2 sm:p-6 bg-blue-50">
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 bg-white rounded shadow p-4 sm:p-8 flex flex-col">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Point of Sale
        </h1>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
        >
          {/* Product Category */}
          <div>
            <label className="block mb-1 text-sm font-medium text-blue-700">
              Product Category
            </label>
            <select
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setProduct('');
              }}
            >
              <option value="">Select category</option>
              {productCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {/* Product Name with Size */}
          <div>
            <label className="block mb-1 text-sm font-medium text-blue-700">
              Product Name (with Size)
            </label>
            <select
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              disabled={!category}
            >
              <option value="">
                {category ? 'Select product' : 'Select category first'}
              </option>
              {filteredProducts.map((p) => (
                <option key={p.name + p.size} value={p.name + ' - ' + p.size}>
                  {p.name} - {p.size}
                </option>
              ))}
            </select>
          </div>
          {/* Table */}
          <div>
            <label className="block mb-1 text-sm font-medium text-blue-700">
              Table
            </label>
            <select
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={table}
              onChange={(e) => setTable(e.target.value)}
            >
              <option value="">Select table</option>
              {tables.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {/* Discount */}
          <div>
            <label className="block mb-1 text-sm font-medium text-blue-700">
              Discount
            </label>
            <select
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            >
              <option value="">Select discount</option>
              {discounts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          {/* Staffs (searchable dropdown) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-blue-700">
              Quantity
            </label>
            <input
              type="number"
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <input
              type="text"
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search staff"
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
            />
            <select
              className="w-full border border-blue-300 rounded px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">Select staff</option>
              {filteredStaffs.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded shadow hover:bg-blue-700 mt-2"
          >
            Add to Cart
          </button>
        </form>
      </div>
      {/* Right: Purchase Summary */}
      <div className="w-full lg:w-1/2 bg-white rounded shadow p-4 sm:p-8 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-700">Purchase Summary</h2>
          <button
            className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700 font-semibold"
            style={{ minHeight: '40px' }}
          >
            Checkout
          </button>
        </div>
        <div className="flex-1 max-h-96 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-gray-500 text-center py-">
              No products added yet.
            </div>
          ) : (
            <ul className="divide-y divide-blue-100 overflow-y-auto">
              {cart.map((item, idx) => (
                <li key={idx} className="flex flex-col gap-1 py-2">
                  <div className="flex justify-between text-gray-500">
                    <span>{item.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
                    <span className="font-semibold">
                      ₱{item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Original: ₱{item.originalPrice.toFixed(2)}</span>
                    <span>
                      Discount:{' '}
                      {item.discountLabel !== 'None'
                        ? `-₱${item.discountAmount.toFixed(2)} (${item.discountLabel})`
                        : '₱0.00'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-2 border-t flex flex-col gap-1 text-lg font-bold">
          <div className="flex justify-between text-base font-normal text-gray-500">
            <span>Subtotal:</span>
            <span>₱{totalOriginal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-normal text-gray-500">
            <span>Total Discount:</span>
            <span>-₱{totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Total:</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
