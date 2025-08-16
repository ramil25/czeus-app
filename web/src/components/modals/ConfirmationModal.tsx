'use client';
import React from 'react';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'warning',
}: ConfirmationModalProps) {
  if (!open) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          titleColor: 'text-red-700',
          confirmButton: 'bg-red-600 hover:bg-red-700 disabled:bg-red-400',
          icon: '⚠️',
        };
      case 'warning':
        return {
          titleColor: 'text-orange-700',
          confirmButton: 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400',
          icon: '⚠️',
        };
      case 'info':
        return {
          titleColor: 'text-blue-700',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400',
          icon: 'ℹ️',
        };
      default:
        return {
          titleColor: 'text-orange-700',
          confirmButton: 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400',
          icon: '⚠️',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">{styles.icon}</span>
          <h2 className={`text-xl font-bold ${styles.titleColor}`}>
            {title}
          </h2>
        </div>
        
        <p className="text-gray-700 mb-6">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmButton}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;