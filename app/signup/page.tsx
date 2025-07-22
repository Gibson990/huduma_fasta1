"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react"
import Link from "next/link"
import { useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("user");
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [providerForm, setProviderForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    documentType: "",
    documentFile: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle user signup logic
    console.log("User signup:", userForm);
  };
  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle provider signup logic
    console.log("Provider signup:", providerForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#2E7D32] rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <CardDescription>
            Join Huduma Faster and start booking or providing services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4 bg-gray-100 rounded-lg">
              <TabsTrigger value="user" className="text-[#2E7D32] font-semibold">User Signup</TabsTrigger>
              <TabsTrigger value="provider" className="text-[#2E7D32] font-semibold">Provider Signup</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                    <label htmlFor="userFirstName" className="text-sm font-medium text-gray-700">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                        id="userFirstName"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                    placeholder="First name"
                        value={userForm.firstName}
                        onChange={e => setUserForm({ ...userForm, firstName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="userLastName" className="text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      id="userLastName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                      placeholder="Last name"
                      value={userForm.lastName}
                      onChange={e => setUserForm({ ...userForm, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                  <label htmlFor="userEmail" className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="userEmail"
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      value={userForm.email}
                      onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="userPhone" className="text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="userPhone"
                      type="tel"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                      value={userForm.phone}
                      onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="userPassword" className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="userPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                      placeholder="Create a password"
                      value={userForm.password}
                      onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="userConfirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="userConfirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                      placeholder="Confirm your password"
                      value={userForm.confirmPassword}
                      onChange={e => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded border-gray-300 text-[#2E7D32] focus:ring-[#2E7D32]"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#2E7D32] hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#2E7D32] hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                <Button type="submit" className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white">Create Account</Button>
                <div className="text-center">
                  <span className="text-sm text-gray-600">Already have an account? </span>
                  <Link href="/login" className="text-sm text-[#2E7D32] hover:underline font-medium">Sign in</Link>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="provider">
              <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="providerFirstName" className="text-sm font-medium text-gray-700">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="providerFirstName"
                        type="text"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                        placeholder="First name"
                        value={providerForm.firstName}
                        onChange={e => setProviderForm({ ...providerForm, firstName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="providerLastName" className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                      id="providerLastName"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                  placeholder="Last name"
                      value={providerForm.lastName}
                      onChange={e => setProviderForm({ ...providerForm, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
                  <label htmlFor="providerEmail" className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                      id="providerEmail"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                      value={providerForm.email}
                      onChange={e => setProviderForm({ ...providerForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
                  <label htmlFor="providerPhone" className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                      id="providerPhone"
                  type="tel"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                  placeholder="Enter your phone number"
                      value={providerForm.phone}
                      onChange={e => setProviderForm({ ...providerForm, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
                  <label htmlFor="providerDocumentType" className="text-sm font-medium text-gray-700">Document Type</label>
              <select
                    id="providerDocumentType"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                    value={providerForm.documentType}
                    onChange={e => setProviderForm({ ...providerForm, documentType: e.target.value })}
                    required
                  >
                    <option value="">Select document type</option>
                    <option value="passport">Passport</option>
                    <option value="driving_license">Driving License</option>
                    <option value="nida">NIDA</option>
                    <option value="brela">BRELA</option>
              </select>
            </div>
                <div className="space-y-2">
                  <label htmlFor="providerDocumentFile" className="text-sm font-medium text-gray-700">Upload Document (PDF)</label>
                  <input
                    id="providerDocumentFile"
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors bg-white"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      setProviderForm(prev => ({ ...prev, documentFile: file }));
                    }}
                    required
                  />
                  {providerForm.documentFile && (
                    <div className="text-xs text-[#2E7D32] mt-1">Selected: {providerForm.documentFile.name}</div>
                  )}
                </div>
            <div className="space-y-2">
                  <label htmlFor="providerPassword" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                      id="providerPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                  placeholder="Create a password"
                      value={providerForm.password}
                      onChange={e => setProviderForm({ ...providerForm, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
                  <label htmlFor="providerConfirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                      id="providerConfirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-colors"
                  placeholder="Confirm your password"
                      value={providerForm.confirmPassword}
                      onChange={e => setProviderForm({ ...providerForm, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                    <Link href="/terms" className="text-[#2E7D32] hover:underline">Terms of Service</Link>{" "}
                and{" "}
                    <Link href="/privacy" className="text-[#2E7D32] hover:underline">Privacy Policy</Link>
              </span>
            </label>
                <Button type="submit" className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white">Create Account</Button>
            <div className="text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
                  <Link href="/login" className="text-sm text-[#2E7D32] hover:underline font-medium">Sign in</Link>
            </div>
          </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 