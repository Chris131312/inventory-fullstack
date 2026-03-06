function ProductList({ products, deleteProduct, updateStock }) {
  if (products.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-sm">
        <p className="text-slate-500">No products available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          <div className="mt-4 flex justify-between items-end">
            <div>
              <p className="text-slate-500 text-sm">Price</p>
              <p className="text-2xl font-bold text-slate-900">
                ${product.price}
              </p>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
              <span
                className={`text-sm font-medium ${product.stock > 0 ? "text-slate-600" : "text-red-500"}`}
              >
                Stock: {product.stock}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStock(product.id, product.stock - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-slate-300 rounded hover:bg-slate-100 text-indigo-600 font-bold"
                >
                  -
                </button>
                <button
                  onClick={() => updateStock(product.id, product.stock + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-slate-300 rounded hover:bg-slate-100 text-indigo-600 font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div
              className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
            >
              {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
            </div>
          </div>
          <button
            onClick={() => deleteProduct(product.id)}
            className="mt-4 w-full bg-red-100 text-red-600 py-2 rpunded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
