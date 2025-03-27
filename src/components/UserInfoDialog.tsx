import React, { useState } from 'react';

interface UserInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userInfo: {
    name: string;
    email: string;
    designation: string;
  }) => void;
}

const UserInfoDialog: React.FC<UserInfoDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#0A021D] p-8 rounded-2xl w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#9351E8] via-[#BF4FFF] to-[#E977B4] bg-clip-text text-transparent">
             🤝  We&apos;d love to know you!
            </h2>
            <p className="text-gray-400 mt-2">
              Your data is safe with us – we respect your privacy.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Your name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-[#150C29] rounded-lg text-white border border-purple-500/30 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Your work email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g., name@company.com"
                className="w-full px-4 py-3 bg-[#150C29] rounded-lg text-white border border-purple-500/30 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Your designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                placeholder="your role in the company"
                className="w-full px-4 py-3 bg-[#150C29] rounded-lg text-white border border-purple-500/30 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-white font-semibold hover:opacity-90 transition"
            >
              Try Emvo Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoDialog; 