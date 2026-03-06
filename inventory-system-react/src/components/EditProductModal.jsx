import { useState } from "react";

function EditProductModal({ product, onSave, onClose }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) return;

    const updatedProduct = {
      ...product,
      name: name,
      price: Number(price),
      category: category,
    };
    onSave(updatedProduct);
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="border p-2 rounded w-full bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font medium text-slate-600 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                className="border p-2 rounded w-full bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Category
              </label>
              <select
                className="border p-2 rounded w-full bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Tech">Tech</option>
                <option value="Accessories">Accessories</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
