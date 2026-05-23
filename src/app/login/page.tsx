"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Flow
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          setError('Invalid email or password');
        } else {
          router.push('/'); // Redirect to home or dashboard after login
          router.refresh();
        }
      } else {
        // Registration Flow
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          // Auto login after successful registration
          const loginRes = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
          if (loginRes?.error) {
            setError(loginRes.error);
          } else {
            router.push('/');
            router.refresh();
          }
        } else {
          const data = await res.json();
          setError(data.error || 'Failed to register');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] flex items-center justify-center pt-20 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-electric-blue/20 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-red/10 blur-[120px] rounded-full opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-gunmetal/60 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Accent Line */}
          <div className={`absolute top-0 left-0 h-1 w-full transition-colors duration-500 ${isLogin ? 'bg-electric-blue' : 'bg-neon-red'}`} />

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join Carverse'}
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              {isLogin ? 'Enter your credentials to access your Dream Garage.' : 'Create an account to start curating your garage.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 mb-6"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-matte-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-electric-blue transition-colors"
                  placeholder="racer@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-matte-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-electric-blue transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-2 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                isLogin 
                  ? "bg-electric-blue text-matte-black hover:bg-electric-blue/90 shadow-[0_0_20px_rgba(0,210,255,0.3)]" 
                  : "bg-neon-red text-white hover:bg-neon-red/90 shadow-[0_0_20px_rgba(255,0,85,0.3)]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className={`font-bold ${isLogin ? 'text-electric-blue' : 'text-neon-red'}`}>
                {isLogin ? 'Register now' : 'Sign In'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
