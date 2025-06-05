import { useState, useEffect, type FormEvent } from 'react';
import authApiInterceptor from '../services/axiosInstance/auth.instance';
import type { DepartmentModalProps } from '../types/props.type';

const DepartmentModal = ({ onClose, onCreated }: DepartmentModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ name?: string }>({});
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
        if (!name.trim()) newErrors.name = 'Department name is required';
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        try {
            await authApiInterceptor.post('/api/department', {
                name,
                description: description.trim() || undefined, // send only if not empty
            });
            onCreated();
        } catch (err) {
            console.error('Error creating department', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1000] flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-fade-in">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Create Department</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Department Name */}
                    <div>
                        <label className={`block mb-2 text-md font-medium ${errors.name ? 'text-red-700' : 'text-gray-900'}`}>
                            Department Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Engineering, Design"
                            className={`w-full text-md rounded-lg block p-2.5 mt-1 focus:outline-none focus:ring-1 ${errors.name
                                ? 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500'
                                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gray-400'
                                }`}
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>}
                    </div>

                    {/* Description (Optional) */}
                    <div>
                        <label className="block mb-2 text-md font-medium text-gray-900">
                            Description <span className="text-gray-400 text-sm">(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the department"
                            rows={3}
                            className="w-full text-md rounded-lg block p-2.5 mt-1 resize-none bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                    </div>

                    {/* Action Buttons */}
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

export default DepartmentModal;
