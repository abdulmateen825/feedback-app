'use client'
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signinschema"
import { ApiResponse } from "@/types/ApiResponse"

export default function page(){

  const router = useRouter()
  
  const [issubmitting , setissubmitting] = useState(false)

 
  
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      identifier:"",
      password:""
    }
  })

 

  const onSubmit  = async (data: z.infer<typeof signInSchema>) => {

    setissubmitting(true)

    
      const response = await signIn("credentials ",{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      })
      if(response?.error){

        toast.error(response.error)

      }else{
      router.replace(`/dashboard}`)
      toast.success("login successful")
      }
     
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

         

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              {...form.register("identifier")}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {form.formState.errors.identifier && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.identifier.message}
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
            {issubmitting ? "Submitting..." : "Signin"}
          </button>

        </form>

      </div>
    </div>
  )
}