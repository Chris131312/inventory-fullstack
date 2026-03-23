import { Package, CircleDollarSign, AlertTriangle } from "lucide-react";

function DashboardStats({ products }) {
  const totalProducts = products.length;

  const totalValue = products.reduce((acc, product) => {
    return acc + product.price * product.stock;
  }, 0);

  const lowStockCount = products.filter((product) => product.stock < 5).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shodow-sm border boder-slate-200 flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
          <Package size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Total Products</p>
          <p className="text-2xl font-bold text-slate-800">{totalProducts}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center-gap">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
          <CircleDollarSign size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Inventory Value</p>
          <p className="text-2xl font-bold text-slate-800">
            ${totalValue.toLocaleString()}
          </p>
        </div>
      </div>
      <div
        className={`p-4 rounded-lg shadow-sm border flex items-center gap-4 transition-colors ${lowStockCount > 0 ? "bg-red-50 border-red-200" : "bg-white border-slate-200"}`}
      >
        <div
          className={`p-3 rounded-full ${lowStockCount > 0 ? "bg-red-100 text-red-600" : "bg-slate-50 text-slate-400"}`}
        >
          <AlertTriangle size={24} strokeWidth={2.5} />
        </div>
        <div>
          <p
            className={`text-sm font-medium ${lowStockCount > 0 ? "text-red-600" : "text-slate-500"}`}
          >
            Low Stock Items
          </p>
          <p
            className={`text-2xl font-bold ${lowStockCount > 0 ? "text-red-700" : "text-slate-800"}`}
          >
            {lowStockCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
