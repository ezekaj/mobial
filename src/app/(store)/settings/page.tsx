"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import QRCode from "qrcode"
import {
  User as UserIcon,
  Mail,
  Lock,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Pencil,
  X,
  Check,
  Copy,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"

type TwoFAStep = "idle" | "loading" | "qr" | "verifying" | "backup_codes"

export default function SettingsPage() {
  const { user, isLoading: authLoading, openAuthModal, refresh } = useAuth()

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false)
  const [editName, setEditName] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)

  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // 2FA setup
  const [twoFAStep, setTwoFAStep] = useState<TwoFAStep>("idle")
  const [twoFASecret, setTwoFASecret] = useState("")
  const [twoFAQrDataUrl, setTwoFAQrDataUrl] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [disabling2FA, setDisabling2FA] = useState(false)

  // Initialize edit name when user loads
  useEffect(() => {
    if (user?.name) {
      setEditName(user.name)
    }
  }, [user?.name])

  const getToken = () => localStorage.getItem("token")

  // Profile save
  const handleSaveProfile = async () => {
    if (!editName.trim() || editName.trim().length < 2) {
      toast.error("Name must be at least 2 characters")
      return
    }

    setSavingProfile(true)
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: editName.trim() }),
      })

      if (res.ok) {
        toast.success("Profile updated successfully")
        setEditingProfile(false)
        await refresh()
      } else {
        const data = await res.json().catch(() => null)
        toast.error(data?.message || "Failed to update profile")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSavingProfile(false)
    }
  }

  // Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPassword || !confirmPassword || !currentPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setChangingPassword(true)
    try {
      const res = await fetch("/api/auth/password/change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        toast.success("Password changed successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const data = await res.json().catch(() => null)
        toast.error(data?.message || "Failed to change password. Please try again.")
      }
    } catch {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setChangingPassword(false)
    }
  }

  // 2FA: Step 1 — Enable (get QR code)
  const handleEnable2FA = async () => {
    setTwoFAStep("loading")
    try {
      const res = await fetch("/api/auth/2fa/enable", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        toast.error(data?.message || "Failed to start 2FA setup")
        setTwoFAStep("idle")
        return
      }

      const { secret, otpAuthUrl } = data.data
      setTwoFASecret(secret)

      // Generate QR code data URL
      const qrDataUrl = await QRCode.toDataURL(otpAuthUrl, {
        width: 200,
        margin: 2,
        color: { dark: "#ffffff", light: "#00000000" },
      })
      setTwoFAQrDataUrl(qrDataUrl)
      setTwoFAStep("qr")
    } catch {
      toast.error("Failed to start 2FA setup")
      setTwoFAStep("idle")
    }
  }

  // 2FA: Step 2 — Verify TOTP code
  const handleVerify2FA = async () => {
    if (totpCode.length !== 6) {
      toast.error("Please enter a 6-digit code")
      return
    }

    setTwoFAStep("verifying")
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ totpCode }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        toast.error(data?.message || "Invalid verification code")
        setTwoFAStep("qr")
        return
      }

      setBackupCodes(data.data.backupCodes)
      setTwoFAStep("backup_codes")
      toast.success("Two-factor authentication enabled!")
      await refresh()
    } catch {
      toast.error("Verification failed. Please try again.")
      setTwoFAStep("qr")
    }
  }

  // 2FA: Disable
  const handleDisable2FA = async () => {
    setDisabling2FA(true)
    try {
      const password = prompt("Enter your password to disable 2FA:")
      if (!password) {
        setDisabling2FA(false)
        return
      }

      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success("Two-factor authentication disabled")
        await refresh()
      } else {
        toast.error(data?.message || "Failed to disable 2FA")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setDisabling2FA(false)
    }
  }

  // Reset 2FA flow
  const handleCancel2FA = () => {
    setTwoFAStep("idle")
    setTwoFASecret("")
    setTwoFAQrDataUrl("")
    setTotpCode("")
    setBackupCodes([])
  }

  // Copy backup codes to clipboard
  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"))
    toast.success("Backup codes copied to clipboard")
  }

  const handleDeleteAccount = () => {
    toast.info("Account deletion requested. Our team will review your request.")
  }

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto">
            <UserIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Sign in to continue</h1>
          <p className="text-muted-foreground font-medium">
            Log in to access your account settings.
          </p>
          <Button
            size="lg"
            className="rounded-2xl px-10 h-14 font-black"
            onClick={() => openAuthModal("login")}
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
      <div className="pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-16 pb-10"
          >
            <Button variant="ghost" className="mb-6 rounded-xl font-bold -ml-2" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground font-medium mt-2">
              Manage your profile, security, and account preferences.
            </p>
          </motion.section>

          <div className="space-y-8">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-black flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-primary" />
                    Profile
                  </CardTitle>
                  <CardDescription>Your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Display Name
                      </Label>
                      {editingProfile ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-12 rounded-xl font-medium"
                          placeholder="Enter your name"
                          autoFocus
                        />
                      ) : (
                        <Input
                          value={user.name || ""}
                          readOnly
                          className="bg-muted/50 border-border/50 h-12 rounded-xl font-medium"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={user.email}
                          readOnly
                          className="bg-muted/50 border-border/50 h-12 rounded-xl font-medium pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  {editingProfile ? (
                    <div className="flex gap-2">
                      <Button
                        className="rounded-xl font-bold"
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl font-bold"
                        onClick={() => {
                          setEditingProfile(false)
                          setEditName(user.name || "")
                        }}
                        disabled={savingProfile}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="rounded-xl font-bold"
                      onClick={() => setEditingProfile(true)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-black flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Security
                  </CardTitle>
                  <CardDescription>Manage your password and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Change Password */}
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <h3 className="font-bold text-sm">Change Password</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="h-12 rounded-xl pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="h-12 rounded-xl pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="h-12 rounded-xl pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="rounded-xl font-bold"
                      disabled={changingPassword}
                    >
                      {changingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>

                  <Separator />

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className={`h-5 w-5 ${user.twoFactorEnabled ? "text-emerald-500" : "text-muted-foreground"}`} />
                        <div>
                          <p className="font-bold text-sm">2FA Status</p>
                          <p className="text-xs text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={user.twoFactorEnabled ? "default" : "outline"}
                        className={`rounded-full font-bold ${user.twoFactorEnabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}`}
                      >
                        {user.twoFactorEnabled ? "Enabled" : "Not Enabled"}
                      </Badge>
                    </div>

                    {/* 2FA Flow */}
                    {twoFAStep === "idle" && !user.twoFactorEnabled && (
                      <Button
                        variant="outline"
                        className="rounded-xl font-bold"
                        onClick={handleEnable2FA}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Enable 2FA
                      </Button>
                    )}

                    {twoFAStep === "loading" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Setting up two-factor authentication...
                      </div>
                    )}

                    {twoFAStep === "qr" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 p-4 rounded-xl border border-border/50 bg-muted/20"
                      >
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Step 1: Scan QR Code
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code.
                          </p>
                        </div>

                        <div className="flex justify-center py-4">
                          {twoFAQrDataUrl && (
                            <img
                              src={twoFAQrDataUrl}
                              alt="2FA QR Code"
                              className="w-[200px] h-[200px] rounded-lg bg-white p-2"
                            />
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Or enter this code manually:
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 p-2 rounded-lg bg-muted text-xs font-mono break-all">
                              {twoFASecret}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(twoFASecret)
                                toast.success("Secret copied to clipboard")
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <h4 className="font-bold text-sm">Step 2: Enter Verification Code</h4>
                          <p className="text-xs text-muted-foreground">
                            Enter the 6-digit code from your authenticator app to verify setup.
                          </p>
                          <div className="flex gap-2">
                            <Input
                              value={totpCode}
                              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              placeholder="000000"
                              className="h-12 rounded-xl font-mono text-center text-lg tracking-[0.5em] max-w-[200px]"
                              maxLength={6}
                            />
                            <Button
                              className="rounded-xl font-bold"
                              onClick={handleVerify2FA}
                              disabled={totpCode.length !== 6}
                            >
                              Verify
                            </Button>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl"
                          onClick={handleCancel2FA}
                        >
                          Cancel Setup
                        </Button>
                      </motion.div>
                    )}

                    {twoFAStep === "verifying" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground p-4 rounded-xl border border-border/50">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying code...
                      </div>
                    )}

                    {twoFAStep === "backup_codes" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5"
                      >
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-500">
                            <Check className="h-4 w-4" />
                            2FA Enabled Successfully
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Save these backup codes in a secure location. Each code can only be used once.
                            If you lose access to your authenticator app, you can use these codes to log in.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {backupCodes.map((code, i) => (
                            <code
                              key={i}
                              className="p-2 rounded-lg bg-muted text-xs font-mono text-center"
                            >
                              {code}
                            </code>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl font-bold"
                            onClick={handleCopyBackupCodes}
                          >
                            <Copy className="mr-2 h-3 w-3" />
                            Copy All Codes
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-xl font-bold"
                            onClick={handleCancel2FA}
                          >
                            Done
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {user.twoFactorEnabled && twoFAStep === "idle" && (
                      <Button
                        variant="outline"
                        className="rounded-xl font-bold text-red-500 hover:text-red-600 hover:border-red-500/50"
                        onClick={handleDisable2FA}
                        disabled={disabling2FA}
                      >
                        {disabling2FA ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Disabling...
                          </>
                        ) : (
                          "Disable 2FA"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-red-500/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-black flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions that affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-4">
                    <div>
                      <p className="font-bold text-sm">Delete Account</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Permanently delete your account and all associated data. This action cannot
                        be undone.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="rounded-xl font-bold">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-black">
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your account, including all your order
                            history, eSIM data, and personal information. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl font-bold">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="rounded-xl font-bold bg-red-500 hover:bg-red-600"
                          >
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
  )
}
