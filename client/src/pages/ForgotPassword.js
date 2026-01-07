// client/src/pages/ForgotPassword.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [zipFile, setZipFile] = useState(null);
  const [shareCode, setShareCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [verifiedUser, setVerifiedUser] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/zip' || file.name.endsWith('.zip'))) {
      setZipFile(file);
      setError('');
    } else {
      setError('Please upload a valid ZIP file');
      setZipFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zipFile) {
      setError('Please upload your ZIP file');
      return;
    }

    if (!shareCode.trim()) {
      setError('Please enter the share code used during registration');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('xmlFile', zipFile);
      formData.append('shareCode', shareCode);

      const response = await api.post('/api/auth/forgot-password', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setVerifiedUser(response.data.user);
      setResetToken(response.data.resetToken);
      setMessage('ZIP file verified successfully! You can now reset your password.');
    } catch (error) {
      setError(error.response?.data?.message || 'Error verifying ZIP file');
    } finally {
      setLoading(false);
    }
  };

  if (verifiedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-brand2">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-brand2">
              Welcome, {verifiedUser.name}! Set your new password below.
            </p>
          </div>
          
          <ResetPasswordForm 
            resetToken={resetToken} 
            onPasswordReset={() => window.location.href = '/login'} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand2">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-brand2">
            Upload your ZIP file and enter the share code to verify your identity and reset your password.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="zipFile" className="block text-sm font-medium text-brand2">
                ZIP Identity File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand2 border-dashed rounded-md hover:border-brand2/60 transition-colors">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-brand2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-brand2">
                    <label
                      htmlFor="zipFile"
                      className="relative cursor-pointer bg-transparent rounded-md font-medium text-brand2 hover:text-white transition-colors"
                    >
                      <span>Upload a file</span>
                      <input
                        id="zipFile"
                        name="zipFile"
                        type="file"
                        accept=".zip"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-brand2">ZIP files only</p>
                  {zipFile && (
                    <p className="text-sm text-green-400 mt-2">
                      Selected: {zipFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="shareCode" className="block text-sm font-medium text-brand2">
                Share Code
              </label>
              <input
                id="shareCode"
                name="shareCode"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-4 py-3 bg-brand2 border border-brand2 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand1 focus:border-transparent transition-colors"
                placeholder="Enter the share code from registration"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className="rounded-md bg-blue-700 bg-opacity-50 p-4 border border-blue-700">
              <p className="text-sm text-blue-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-blue-700 bg-opacity-50 p-4 border border-blue-700">
              <p className="text-sm text-blue-700">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || !zipFile || !shareCode.trim()}
              className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-full text-brand1 bg-brand2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand1 disabled:opacity-50 transition-all"
            >
              {loading ? 'Verifying...' : 'Verify ZIP & Reset Password'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-brand2 hover:text-white transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reset Password Form Component
const ResetPasswordForm = ({ resetToken, onPasswordReset }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/api/auth/reset-password', {
        resetToken,
        newPassword,
      });
      
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        onPasswordReset();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-brand2">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            className="mt-1 appearance-none relative block w-full px-4 py-3 bg-brand2 border border-brand2 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand1 focus:border-transparent transition-colors"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand2">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="mt-1 appearance-none relative block w-full px-4 py-3 bg-brand2 border border-brand2 rounded-md text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand1 focus:border-transparent transition-colors"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <div className="rounded-md bg-blue-700 bg-opacity-50 p-4 border border-blue-700">
          <p className="text-sm text-blue-700">{message}</p>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-blue-700 bg-opacity-50 p-4 border border-blue-700">
          <p className="text-sm text-blue-700">{error}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-full text-brand1 bg-brand2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand1 disabled:opacity-50 transition-all"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;