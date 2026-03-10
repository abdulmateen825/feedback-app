'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupschema"
import { ApiResponse } from "@/types/ApiResponse"
import { MessageCircle, Loader2, User, Mail, Lock, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpPage(){

  const router = useRouter()
  const [username, setusername] = useState('')
  const [usernamemessage, setusernamemessage] = useState("")
  const [ischeckingusername, setischeckingusername] = useState(false)
  const [issubmitting, setissubmitting] = useState(false)

  const [debouncedUsername] = useDebounceValue(username, 300)
  
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  })

  useEffect(()=>{
    if(!debouncedUsername) return

    const checkusername = async()=>{
      setischeckingusername(true)
      setusernamemessage("")
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`
        )
        setusernamemessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setusernamemessage(
          axiosError.response?.data.message ||
          "An error occurred while checking username uniqueness."
        )
      }
      finally{
        setischeckingusername(false)
      }
    }

    checkusername()

  },[debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setissubmitting(true)
    try {
      const response = await axios.post('/api/sign-up', data);
      toast.success(response.data.message);
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "An error occurred during signup.")
    } finally {
      setissubmitting(false)
    }
  }

  const isUsernameAvailable = usernamemessage.toLowerCase().includes('available') || usernamemessage.toLowerCase().includes('unique');

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full" style={{background: 'radial-gradient(circle, oklch(0.78 0.12 290 / 0.35) 0%, transparent 70%)'}} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full" style={{background: 'radial-gradient(circle, oklch(0.75 0.14 315 / 0.25) 0%, transparent 70%)'}} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary shadow-lg glow-primary mb-4">
            <MessageCircle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start receiving anonymous messages today</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-purple-100 rounded-2xl shadow-xl p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  {...form.register("username")}
                  onChange={(e) => {
                    form.setValue("username", e.target.value)
                    setusername(e.target.value)
                  }}
                  placeholder="your_username"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-gray-50/50"
                />
                {!ischeckingusername && usernamemessage && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isUsernameAvailable
                      ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                      : <XCircle className="h-4 w-4 text-red-400" />
                    }
                  </div>
                )}
                {ischeckingusername && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400 animate-spin" />
                )}
              </div>
              {usernamemessage && !ischeckingusername && (
                <p className={`text-xs mt-1.5 ${isUsernameAvailable ? 'text-green-600' : 'text-red-500'}`}>
                  {usernamemessage}
                </p>
              )}
              {form.formState.errors.username && (
                <p className="text-xs text-red-500 mt-1.5">{form.formState.errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  {...form.register("email")}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-gray-50/50"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  {...form.register("password")}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-gray-50/50"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500 mt-1.5">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={issubmitting}
              className="w-full gradient-primary text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 glow-primary mt-2"
            >
              {issubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
              ) : (
                <>Create account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-purple-600 hover:text-purple-700 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}