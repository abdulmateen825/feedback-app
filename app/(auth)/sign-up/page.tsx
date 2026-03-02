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

export default function page(){

  const router = useRouter()
  const [username , setusername] = useState('')
  const [usernamemessage , setusernamemessage] = useState("")
  const [ischeckingusername , setischeckingusername] = useState(false)
  const [issubmitting , setissubmitting] = useState(false)

  const [debouncedUsername] = useDebounceValue(username , 300)
  
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

  const onSubmit  = async (data: z.infer<typeof signupSchema>) => {

    setissubmitting(true)

    try {
      const response = await axios.post("/api/signup" , data)
      toast.success(response.data.message)
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast.error(errorMessage || "An error occurred during signup.")
    } finally {
      setissubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block mb-1 font-medium">
              Username
            </label>
            <input
              type="text"
              {...form.register("username")}
              onChange={(e) => {
                form.setValue("username", e.target.value)
                setusername(e.target.value)
              }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />

            {ischeckingusername && (
              <p className="text-sm text-gray-500 mt-1">
                Checking username...
              </p>
            )}

            {usernamemessage && !ischeckingusername && (
              <p className="text-sm mt-1">
                {usernamemessage}
              </p>
            )}

            {form.formState.errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              {...form.register("email")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              {...form.register("password")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={issubmitting}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {issubmitting ? "Submitting..." : "Signup"}
          </button>

        </form>

      </div>
    </div>
  )
}