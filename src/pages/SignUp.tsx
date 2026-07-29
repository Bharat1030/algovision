import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function SignUp() {
  const navigate = useNavigate()
  const { signUp, loading, error, clearError } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  const validate = (): boolean => {
    const errors: FormErrors = {}

    if (!name.trim()) {
      errors.name = 'Name is required'
    } else if (name.trim().length < 2) {
      errors.name = 'Must be at least 2 characters'
    }

    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Minimum 6 characters'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    setSuccess(false)

    if (!validate()) return

    const result = await signUp(name.trim(), email.trim(), password)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => navigate('/'), 1200)
    }
  }

  return (
    <div className="min-h-screen text-ink font-body flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-md">
        {/* Panel */}
        <div className="border border-panel-border bg-panel relative">
          <div className="absolute -top-[11px] left-4 bg-bg px-2 font-mono text-[10px] text-accent tracking-wide">
            FIG. 02 — NEW ACCOUNT
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <span className="font-mono text-[11px] text-accent tracking-widest uppercase">
                AlgoVision · Auth
              </span>
              <h1 className="font-display font-semibold text-3xl mt-3">
                Create your account
              </h1>
              <p className="text-ink-dim text-sm mt-2 leading-relaxed">
                Join AlgoVision and start visualizing algorithms.
              </p>
            </div>

            {/* Status banners */}
            {error && (
              <div className="mb-6 border border-red-400/30 bg-red-400/5 px-4 py-3 font-mono text-xs text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 border border-accent-2/30 bg-accent-2/5 px-4 py-3 font-mono text-xs text-accent-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Account created. Redirecting…
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wide text-ink-dim mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-bg border px-3 py-2.5 font-mono text-sm text-ink placeholder-ink-faint focus:outline-none transition ${
                    fieldErrors.name
                      ? 'border-red-400/50 focus:border-red-400'
                      : 'border-panel-border focus:border-accent'
                  }`}
                  placeholder="Ada Lovelace"
                />
                {fieldErrors.name && (
                  <p className="font-mono text-[11px] text-red-400 mt-1.5">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wide text-ink-dim mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-bg border px-3 py-2.5 font-mono text-sm text-ink placeholder-ink-faint focus:outline-none transition ${
                    fieldErrors.email
                      ? 'border-red-400/50 focus:border-red-400'
                      : 'border-panel-border focus:border-accent'
                  }`}
                  placeholder="you@example.com"
                />
                {fieldErrors.email && (
                  <p className="font-mono text-[11px] text-red-400 mt-1.5">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wide text-ink-dim mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-bg border px-3 py-2.5 pr-10 font-mono text-sm text-ink placeholder-ink-faint focus:outline-none transition ${
                      fieldErrors.password
                        ? 'border-red-400/50 focus:border-red-400'
                        : 'border-panel-border focus:border-accent'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-dim transition"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="font-mono text-[11px] text-red-400 mt-1.5">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wide text-ink-dim mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-bg border px-3 py-2.5 pr-10 font-mono text-sm text-ink placeholder-ink-faint focus:outline-none transition ${
                      fieldErrors.confirmPassword
                        ? 'border-red-400/50 focus:border-red-400'
                        : 'border-panel-border focus:border-accent'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-dim transition"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="font-mono text-[11px] text-red-400 mt-1.5">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full font-mono text-sm bg-accent text-bg px-6 py-3 font-semibold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account…
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Success
                  </>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>
          </div>

          <div className="border-t border-panel-border px-8 py-4 text-center">
            <span className="font-mono text-xs text-ink-faint">
              Already have an account?{' '}
              <Link to="/signin" className="text-accent hover:opacity-80 transition">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}