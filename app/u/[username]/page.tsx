'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { messageschema } from '@/schemas/messageschema';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Loader2, Send, MessageCircle, Shield, Lock } from 'lucide-react';

export default function SendMessagePage() {
  const params = useParams();
  const username = params.username as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof messageschema>>({
    resolver: zodResolver(messageschema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: z.infer<typeof messageschema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content: data.content,
      });
      toast.success(response.data.message);
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full" style={{background: 'radial-gradient(circle, oklch(0.78 0.12 290 / 0.35) 0%, transparent 70%)'}} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full" style={{background: 'radial-gradient(circle, oklch(0.75 0.14 315 / 0.25) 0%, transparent 70%)'}} />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary shadow-lg glow-primary mb-4">
            <MessageCircle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Send an anonymous message</h1>
          <p className="text-gray-500 mt-1.5">
            to <span className="font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-3 py-0.5 text-sm">@{username}</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-purple-100 rounded-2xl shadow-xl p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Message</label>
              <textarea
                {...form.register('content')}
                rows={5}
                placeholder="Write your honest, anonymous message here..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-gray-50/50 resize-none"
              />
              {form.formState.errors.content && (
                <p className="text-xs text-red-500 mt-1.5">{form.formState.errors.content.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-primary text-white border-0 hover:opacity-90 gap-2 py-2.5 rounded-xl glow-primary font-semibold"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
              ) : (
                <><Send className="h-4 w-4" /> Send Message</>
              )}
            </Button>
          </form>
        </div>

        {/* Privacy badges */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Shield className="h-3.5 w-3.5 text-purple-400" />
            100% Anonymous
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock className="h-3.5 w-3.5 text-purple-400" />
            Fully Private
          </div>
        </div>
      </div>
    </div>
  );
}