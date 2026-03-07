function Header({ user, onLogout }) {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📦</span>
          <h1 className="text-xl font-bold tracking-wide">
            Inventory Managment System
          </h1>
        </div>
        {user && (
          <div className="flex items-enter gap-4">
            <span className="text-slate-300 text-sm hidden sm:inline">
              Hi, {user.name}
            </span>
            <button
              onClick={onLogout}
              className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1.5 rounded transition-colors text-slate-200 border border-slate-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
