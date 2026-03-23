import { Package, LogOut, UserCircle } from "lucide-react";

function Header({ user, onLogout }) {
  return (
    <header className="bg-slate-950 text-white p-5 shadow-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-3">
          <Package className="text-indigo-400 w-8 h-8" strokeWidth={2.5} />
          <h1 className="text-2xl font-bold tracking-tight">
            Inventory <span className="text-indigo-400">Pro</span>
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-6 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 shadow-inner">
            <div className="flex items-center gap-2">
              <UserCircle className="text-slate-400 w-5 h-5" />
              <span className="text-slate-200 text-sm font-medium">
                Welcome, {user.name}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              className="group flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-700 hover:bg-red-600 rounded-full transition-all duration-300 text-slate-200 border border-slate-600 hover:border-red-500 hover:shadow-lg"
            >
              Logout
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
