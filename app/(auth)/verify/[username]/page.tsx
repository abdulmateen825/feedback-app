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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Verify Account
        </h2>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">

          {/* Verification Code Field */}
          <div>
            <label className="block mb-1 font-medium">
              Enter verification code sent to your email
            </label>

            <input
              type="text"
              {...form.register("code")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />

            {form.formState.errors.code && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={issubmitting}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {issubmitting ? "Verifying..." : "Verify"}
          </button>

        </form>

      </div>
    </div>
  )
}

export default Verifyaccount