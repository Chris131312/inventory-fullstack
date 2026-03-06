import { useState } from "react";

function ProductForm({ addProduct }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("General");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) return;

    const newProduct = {
      id: Date.now(),
      name: name,
      price: Number(price),
      category: category,
      stock: 10,
    };

    addProduct(newProduct);
    setName("");
    setPrice("");
    setCategory("General");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-8"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Product</h2>

      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 rounded flex-1 min-w-[200px]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 rounded w-32"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <select
          className="border p-2 rounded w-40 bg-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="General">General</option>
          <option value="Tech">Tech</option>
          <option value="Accesories">Accesories</option>
          <option value="Clothing">Clothing</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
