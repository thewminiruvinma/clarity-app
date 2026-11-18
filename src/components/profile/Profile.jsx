import { useState } from "react"
import { useApp } from "../../context/AppContext"
import { User, Mail, Lock, Phone, CheckCircle2 } from "lucide-react"

export default function Profile() {
  const { user, updateProfile, crisisTextNumber, updateCrisisNumber } = useApp()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [textNumber, setTextNumber] = useState(crisisTextNumber || "741741")
  
  const [successMessage, setSuccessMessage] = useState("")

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (updateProfile) {
      updateProfile({ name, email })
    }
    if (updateCrisisNumber) {
      updateCrisisNumber(textNumber)
    }
    
    setSuccessMessage("Profile and settings updated successfully!")
    setTimeout(() => setSuccessMessage(""), 4000)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
          Profile & Preferences
        </h1>
        <p className="text-sm text-muted">
          Manage your account details, security credentials, and emergency support settings.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          <CheckCircle2 size={20} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6 rounded-3xl border border-lavender-border bg-white/80 p-8 shadow-sm backdrop-blur-md">
        
        {/* Personal Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <User size={18} className="text-primary" /> Personal Information
          </h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-lavender-border bg-[#FAF8FC] px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-lavender-border bg-[#FAF8FC] pl-11 pr-4 py-3 text-sm text-ink focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-lavender-border/60" />

        {/* Password Update */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Lock size={18} className="text-primary" /> Security & Password
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-2xl border border-lavender-border bg-[#FAF8FC] px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-lavender-border bg-[#FAF8FC] px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-lavender-border/60" />

        {/* Emergency Crisis Line Settings */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Phone size={18} className="text-[#9B4D55]" /> Emergency Support Configuration
          </h2>
          <p className="text-xs text-muted">
            Configure the custom crisis text number. This will instantly preview and update inside your Emergency Support modal.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Crisis Text Line Number
            </label>
            <input
              type="text"
              value={textNumber}
              onChange={(e) => setTextNumber(e.target.value)}
              className="w-full max-w-xs rounded-2xl border border-lavender-border bg-[#FAF8FC] px-4 py-3 text-sm text-ink focus:border-primary focus:outline-none font-semibold"
              required
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            Save Changes
          </button>
        </div>

      </form>
    </div>
  )
}