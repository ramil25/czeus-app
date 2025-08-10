import React from 'react';

export interface ProductForm {
  name: string;
  category: string;
  size: string;
  price: string;
  status: 'Available' | 'Not Available';
}

interface AddProductModalProps {
  open: boolean;
  form: ProductForm;
  setForm: (form: ProductForm) => void;
  onCancel: () => void;
  onAdd: () => void;
  categories?: string[];
  sizesList?: string[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  form,
  setForm,
  onCancel,
  onAdd,
  categories = [
    'Coffee',
    'Tea',
    'Pastries',
    'Sandwiches',
    'Salads',
    'Smoothies',
    'Breakfast',
    'Desserts',
    'Juices',
    'Snacks',
  ],
  sizesList = [
    'Small',
    'Medium',
    'Large',
    'Regular',
    'Slice',
    'Whole',
    'Single',
    'Double',
    'Bowl',
  ],
}) => {
  if (!open) return null;

  const handleInputChange = (
    field: keyof ProductForm,
    value: string | ProductForm['status']
  ) => {
    setForm({ ...form, [field]: value });
  };

  const isFormValid = () => {
    return (
      form.name.trim() &&
      form.category.trim() &&
      form.size.trim() &&
      form.price.trim() &&
      !isNaN(Number(form.price)) &&
      Number(form.price) > 0 &&
      form.status
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-blue-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Add Product
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter product name"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              value={form.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Size Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size *
            </label>
            <select
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              value={form.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
            >
              <option value="">Select size</option>
              {sizesList.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="w-full border border-blue-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-black bg-blue-50"
              placeholder="Enter price"
              value={form.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <div className="flex items-center gap-3 mt-1">
              <span
                className={
                  form.status === 'Available'
                    ? 'text-green-600 font-semibold'
                    : 'text-gray-400'
                }
              >
                Available
              </span>
              <button
                type="button"
                aria-pressed={form.status === 'Available'}
                onClick={() =>
                  handleInputChange(
                    'status',
                    form.status === 'Available' ? 'Not Available' : 'Available'
                  )
                }
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                  form.status === 'Available' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    form.status === 'Available'
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
              <span
                className={
                  form.status === 'Not Available'
                    ? 'text-red-600 font-semibold'
                    : 'text-gray-400'
                }
              >
                Not Available
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-6 py-2 bg-white border border-blue-200 text-black rounded hover:bg-blue-100 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onAdd}
            disabled={!isFormValid()}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
