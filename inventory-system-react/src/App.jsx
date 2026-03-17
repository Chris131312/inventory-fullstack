import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import EditProductModal from "./components/EditProductModal";
import LoginPage from "./components/LoginPage";
import DashboardStats from "./components/DashboardStats";

function App() {
  // State management
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("inventory_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Fetch products on load
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized or session expired");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Save products to local storage for backup
  useEffect(() => {
    localStorage.setItem("inventory_products", JSON.stringify(products));
  }, [products]);

  // Auth functions
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("inventory_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("inventory_user");
    toast.info("You have been logged out.");
  };

  // Add new product
  const handleAddProduct = async (newProductData) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProductData),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();
      setProducts([...products, data]);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error: Could not connect to the server.");
    }
  };

  // Update stock (+ / - buttons)
  const handleUpdateStock = async (id, newStock) => {
    if (newStock < 0) return;
    const token = localStorage.getItem("token");

    // Update UI immediately
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, stock: newStock };
      }
      return product;
    });
    setProducts(updatedProducts);

    const productToSend = updatedProducts.find((p) => p.id === id);

    // Send update to server
    try {
      const response = await fetch(`http://127.0.0.1:8000/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productToSend),
      });

      if (!response.ok) throw new Error("Failed to update stock");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Error updating stock on server");
    }
  };

  // Prepare product for deletion
  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
  };

  // Confirm and delete product
  const confirmDelete = async () => {
    if (!productToDelete) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${productToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Error deleting product on server");
      }

      const product = products.find((p) => p.id === productToDelete);
      const newProducts = products.filter((p) => p.id !== productToDelete);

      setProducts(newProducts);
      setProductToDelete(null); // Close modal

      if (product) {
        toast.error(`${product.name} removed from system.`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error: Could not delete product");
    }
  };

  // Save edited product
  const handleSaveEdit = async (updatedProduct) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        },
      );

      if (!response.ok) throw new Error("Failed to update product");

      const data = await response.json();

      setProducts(products.map((p) => (p.id === data.id ? data : p)));
      setProductToEdit(null); // Close modal
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };

  // Search and filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Render Login if user is not authenticated
  if (!user) {
    return (
      <>
        <Toaster richColors position="bottom-right" />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  // Render Main Dashboard
  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster richColors position="bottom-right" />

      <Header user={user} onLogout={handleLogout} />

      <main className="p-8 max-w-7xl mx-auto">
        <DashboardStats products={products} />
        <ProductForm addProduct={handleAddProduct} />

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products by name..."
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
          editProduct={(product) => setProductToEdit(product)}
        />
      </main>

      {/* Delete Confirmation Modal */}
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

      {/* Edit Product Modal */}
      {productToEdit !== null && (
        <EditProductModal
          product={productToEdit}
          onSave={handleSaveEdit}
          onClose={() => setProductToEdit(null)}
        />
      )}
    </div>
  );
}

export default App;
