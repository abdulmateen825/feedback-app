'use client'
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import React, { useState } from 'react'
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signinschema"
import { MessageCircle, Loader2, Mail, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SignInPage(){

  const router = useRouter()
  const [issubmitting, setissubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      identifier:"",
      password:""
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setissubmitting(true)
    const response = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if (response?.error) {
      toast.error(response.error);
    } else {
      router.replace('/dashboard');
      toast.success('Welcome back!');
    }
    setissubmitting(false)
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your Mystery Message account</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-purple-100 rounded-2xl shadow-xl p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  {...form.register("identifier")}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-gray-50/50"
                />
              </div>
              {form.formState.errors.identifier && (
                <p className="text-xs text-red-500 mt-1.5">{form.formState.errors.identifier.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
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
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="font-semibold text-purple-600 hover:text-purple-700 transition">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}