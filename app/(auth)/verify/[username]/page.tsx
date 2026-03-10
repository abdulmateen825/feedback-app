'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { verifyschema } from '@/schemas/verifyschema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { MessageCircle, Loader2, ShieldCheck, ArrowRight, Mail } from 'lucide-react'

const Verifyaccount = () => {

  const router = useRouter()
  const params = useParams()
  const [issubmitting, setissubmitting] = useState(false)

  const form = useForm<z.infer<typeof verifyschema>>({
    resolver: zodResolver(verifyschema),
  })

  const submit = async (data: z.infer<typeof verifyschema>) => {
    setissubmitting(true)
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username as string,
        code: data.code
      })
      toast.success(response.data.message || "Account verified")
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      toast.error(errorMessage || "Verification failed.")
    } finally {
      setissubmitting(false)
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full" style={{background: 'radial-gradient(circle, oklch(0.78 0.12 290 / 0.35) 0%, transparent 70%)'}} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full" style={{background: 'radial-gradient(circle, oklch(0.75 0.14 315 / 0.25) 0%, transparent 70%)'}} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary shadow-lg glow-primary mb-4">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify your account</h1>
          <p className="text-gray-500 mt-1 text-sm">
            We sent a code to your email. Enter it below.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-purple-100 rounded-2xl shadow-xl p-8">
          {/* Info box */}
          <div className="flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-xl p-3.5 mb-6">
            <Mail className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
            <p className="text-sm text-purple-700">
              Check your inbox for a 6-digit verification code for{' '}
              <span className="font-semibold">@{params.username}</span>
            </p>
          </div>

          <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Verification Code
              </label>
              <input
                type="text"
                {...form.register("code")}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-gray-50/50"
              />
              {form.formState.errors.code && (
                <p className="text-xs text-red-500 mt-1.5">{form.formState.errors.code.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={issubmitting}
              className="w-full gradient-primary text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 glow-primary"
            >
              {issubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
              ) : (
                <>Verify account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <MessageCircle className="h-4 w-4 text-purple-400" />
          <p className="text-sm text-gray-500">Didn&apos;t get the email? Check your spam folder.</p>
        </div>
      </div>
    </div>
  )
}

export default Verifyaccount