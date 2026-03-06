import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import EditProductModal from "./components/EditProductModal";

function App() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("inventory_products");
    if (savedProducts) {
      return JSON.parse(savedProducts);
    } else {
      return [
        {
          id: 1,
          name: "Gaming Laptop",
          price: 1500,
          category: "Tech",
          stock: 5,
        },
        {
          id: 2,
          name: "Wireless Mouse",
          price: 25,
          category: "Accessories",
          stock: 12,
        },
      ];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  useEffect(() => {
    localStorage.setItem("inventory_products", JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
    toast.success(`${newProduct.name} added to inventory!`);
  };

  const handleUpdateStock = (id, newStock) => {
    if (newStock < 0) return;

    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, stock: newStock };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;

    const product = products.find((p) => p.id === productToDelete);
    const newProducts = products.filter((p) => p.id !== productToDelete);

    setProducts(newProducts);

    if (product) {
      toast.error(`${product.name} removed from system.`);
    }

    setProductToDelete(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster richColors position="bottom-right" />

      <Header />

      <main className="p-8 max-w-7xl mx-auto">
        <ProductForm addProduct={handleAddProduct} />

        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="🔍 Search products by name..."
            className="flex-1 p-3 rounded bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="p-3 rounded bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 mt-8">
          Current Inventory
        </h2>

        <ProductList
          products={filteredProducts}
          deleteProduct={handleDeleteProduct}
          updateStock={handleUpdateStock}
        />
      </main>

      {productToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
