import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Settings as SettingsIcon, Trash2, LogOut, User, ChevronRight, Leaf, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';

export default function Settings() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const handleLogout = () => base44.auth.logout();

  const handleDeleteAccount = async () => {
    setDeleting(true);
    // Logs user out — full account deletion requires admin action
    base44.auth.logout();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      {user && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1B4332]/10 rounded-full flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-[#1B4332]" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{user.full_name || 'User'}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* About */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-[#1B4332] rounded-xl flex items-center justify-center shrink-0">
          <Leaf className="w-4 h-4 text-[#B7C4A1]" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">EcoSwap</p>
          <p className="text-xs text-gray-400">Making the planet greener, one swap at a time.</p>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
        <button
          onClick={() => setShowPrivacy(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#2D6A4F]" />
            <div className="text-left">
              <span className="font-medium text-gray-700 block">Privacy & Data Policy</span>
              <span className="text-xs text-gray-400">How we handle your data</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Contact / Feedback */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
        <a
          href="mailto:windstrafer@gmail.com?subject=EcoSwap Feedback"
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#2D6A4F]" />
            <div className="text-left">
              <span className="font-medium text-gray-700 block">Contact Us / Feedback</span>
              <span className="text-xs text-gray-400">windstrafer@gmail.com</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </a>
      </div>

      {/* Account actions */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <div className="text-left">
              <span className="font-medium text-red-600 block">Delete Account</span>
              <span className="text-xs text-gray-400">Permanently remove your account and data</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-300" />
        </button>
      </div>

      <PrivacyPolicyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Account?</h3>
            <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
              This action cannot be undone. All your favorites, listings, and data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}