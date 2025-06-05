import { useState, useEffect, type FormEvent } from 'react';
import authApiInterceptor from '../services/axiosInstance/auth.instance';
import type { StatusModalProps } from '../types/props.type';

const StatusModal = ({ onClose, onCreated }: StatusModalProps) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');
  const [errors, setErrors] = useState<{ title?: string; color?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Status title is required';
    if (!color.trim()) newErrors.color = 'Color is required';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await authApiInterceptor.post('/api/status', { title, color });
      onCreated();
    } catch (err) {
      console.error('Error creating status', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex justify-center items-center z-[1000]">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Create New Status</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div>
            <label className={`block mb-2 text-md font-medium ${errors.title ? 'text-red-700' : 'text-gray-900'}`}>
              Status Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter status title"
              className={`w-full text-md rounded-lg block p-2.5 mt-1 focus:outline-none focus:ring-1 ${errors.title
                ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gray-400'
                }`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Color Picker */}
          <div>
            <label className={`block mb-2 text-md font-medium ${errors.color ? 'text-red-700' : 'text-gray-900'}`}>
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 border-none bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#RRGGBB"
                className={`flex-1 px-3 py-2 rounded-lg text-md focus:outline-none focus:ring-1 ${errors.color
                  ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500'
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gray-400'
                  }`}
              />
            </div>
            {errors.color && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.color}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusModal;
