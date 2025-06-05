import { useAuth } from '../context/AuthContext';
import StatusBoard from './StatusBoard';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header Area */}
      <div className="p-8 pb-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
      {/* StatusBoard takes remaining height and scrolls inside */}
      <div className="flex-1 min-h-0 overflow-hidden px-8 pb-8">
        <StatusBoard />
      </div>
    </div>

  );
}

export default Dashboard;