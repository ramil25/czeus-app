'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignInWithEmail } from '@/hooks/useSignInWithEmail';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { mutate, isPending } = useSignInWithEmail();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { email, password },
      {
        onSuccess: async () => {
          // Optionally check session or just redirect
          router.push('/dashboard');
        },
        onError: (err: Error) => {
          toast.error(err.message, { position: 'top-center' });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={120}
          height={32}
          className="mb-6"
        />
        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          Sign in to your account
        </h1>
        <p className="text-blue-500 mb-6">
          Welcome back! Please enter your details.
        </p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="email" className="text-sm font-medium text-blue-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-black focus:ring-blue-300"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
          <label
            htmlFor="password"
            className="text-sm font-medium text-blue-700"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-blue-200 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
            disabled={isPending}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold rounded-lg py-2 mt-2 hover:bg-blue-700 transition-colors"
            disabled={isPending}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
