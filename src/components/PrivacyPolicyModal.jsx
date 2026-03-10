import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';

export default function PrivacyPolicyModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#1B4332]/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#1B4332]" />
                </div>
                <h2 className="font-bold text-gray-900">Privacy & Data Policy</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-5 py-4 space-y-5 text-sm text-gray-600 leading-relaxed">
              <p className="text-xs text-gray-400">Last updated: March 2026</p>

              <Section title="1. What Data We Collect">
                <p>When you use EcoSwap, we collect the following information:</p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li><strong>Account info</strong> — your name and email address, provided at sign-up.</li>
                  <li><strong>Content you create</strong> — swap listings, product reviews, and ratings you submit.</li>
                  <li><strong>Favorites</strong> — products you save for later reference.</li>
                  <li><strong>Usage data</strong> — pages visited and features used, to improve the app.</li>
                </ul>
              </Section>

              <Section title="2. How We Use Your Data">
                <ul className="list-disc ml-4 space-y-1">
                  <li>To provide and operate the EcoSwap platform.</li>
                  <li>To display your listings and reviews to the community.</li>
                  <li>To send you responses when you contact us via the feedback email.</li>
                  <li>To improve app performance and user experience.</li>
                </ul>
              </Section>

              <Section title="3. Data Sharing">
                <p>We do <strong>not</strong> sell or share your personal data with third parties for marketing purposes. Your contact email on swap listings is only visible when you explicitly choose to display it.</p>
              </Section>

              <Section title="4. Data Storage">
                <p>All data is stored securely on the Base44 platform. We retain your data for as long as your account is active. You may request deletion at any time by contacting us.</p>
              </Section>

              <Section title="5. Your Rights">
                <ul className="list-disc ml-4 space-y-1">
                  <li><strong>Access</strong> — request a copy of the data we hold about you.</li>
                  <li><strong>Correction</strong> — ask us to correct inaccurate data.</li>
                  <li><strong>Deletion</strong> — delete your account via Settings, or email us to remove all associated data.</li>
                </ul>
              </Section>

              <Section title="6. Cookies & Local Storage">
                <p>EcoSwap uses browser local storage solely to remember your Shopee region preference. No tracking cookies are used.</p>
              </Section>

              <Section title="7. Contact">
                <p>For any privacy-related questions, please email us at{' '}
                  <a href="mailto:windstrafer@gmail.com" className="text-[#2D6A4F] underline">windstrafer@gmail.com</a>.
                </p>
              </Section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
      {children}
    </div>
  );
}