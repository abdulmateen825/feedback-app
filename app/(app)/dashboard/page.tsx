'use client';

import { Message } from '@/model/User';
import { acceptmessageschema } from '@/schemas/acceptmessageschema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Messagecard from '@/components/ui/Messagecard';
import { Loader2, RefreshCcw, Copy, Sparkles, MessageCircle, Link2, ToggleLeft, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m._id.toString() !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptmessageschema>>({
    resolver: zodResolver(acceptmessageschema),
    defaultValues: { acceptmessage: true },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch('acceptmessage');

  const fetchAcceptMessages = useCallback(async () => {
    setSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message');
      setValue('acceptmessage', response.data.isacceptingmessage ?? true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch message settings');
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) toast.success('Messages refreshed');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        acceptmessages: !acceptMessages,
      });
      setValue('acceptmessage', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Failed to update');
    }
  };

  const fetchSuggestedMessages = async () => {
    setSuggestLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/suggest-messages');
      const text = (response.data as unknown as { messages: string }).messages;
      setSuggestedMessages(text.split('||').map((s: string) => s.trim()).filter(Boolean));
    } catch {
      toast.error('Failed to fetch suggestions');
    } finally {
      setSuggestLoading(false);
    }
  };

  const username = session?.user?.username;
  const profileUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/u/${username}`
      : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Link copied to clipboard');
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-3" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Welcome back, <span className="gradient-text">@{username}</span>
          </h1>
          <p className="text-gray-500">Manage your anonymous messages and profile settings</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="gradient-card rounded-2xl p-5 border border-purple-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                <p className="text-sm text-gray-500">Total Messages</p>
              </div>
            </div>
          </div>
          <div className="gradient-card rounded-2xl p-5 border border-purple-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${acceptMessages ? 'bg-green-100' : 'bg-red-100'}`}>
                <ToggleLeft className={`h-5 w-5 ${acceptMessages ? 'text-green-600' : 'text-red-500'}`} />
              </div>
              <div>
                <p className={`text-lg font-bold ${acceptMessages ? 'text-green-600' : 'text-red-500'}`}>
                  {acceptMessages ? 'Active' : 'Paused'}
                </p>
                <p className="text-sm text-gray-500">Message Status</p>
              </div>
            </div>
          </div>
          <div className="gradient-card rounded-2xl p-5 border border-purple-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 truncate max-w-[140px]">/u/{username}</p>
                <p className="text-sm text-gray-500">Your Profile URL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Link Card */}
        <div className="gradient-card rounded-2xl border border-purple-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-purple-500" />
            Your Shareable Link
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-sm text-purple-700 font-mono truncate">
              {profileUrl}
            </div>
            <Button
              onClick={copyToClipboard}
              className="gradient-primary text-white border-0 hover:opacity-90 shrink-0 gap-1.5"
              size="sm"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Share this link so people can send you anonymous messages</p>
        </div>

        {/* Accept messages toggle */}
        <div className="gradient-card rounded-2xl border border-purple-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <ToggleLeft className="h-4 w-4 text-purple-500" />
                Accept Messages
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {acceptMessages ? 'You are currently accepting new messages' : 'Message receiving is paused'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${acceptMessages ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {acceptMessages ? 'On' : 'Off'}
              </span>
              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={switchLoading}
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="gradient-card rounded-2xl border border-purple-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Inbox className="h-4 w-4 text-purple-500" />
              Your Messages
              {messages.length > 0 && (
                <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-0.5 font-medium">
                  {messages.length}
                </span>
              )}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchMessages(true)}
              disabled={loading}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 gap-1.5"
            >
              {loading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <RefreshCcw className="h-3.5 w-3.5" />
              }
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-purple-300" />
              </div>
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-gray-400 text-sm mt-1">Share your link to start receiving anonymous messages!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map((message) => (
                <Messagecard
                  key={message._id.toString()}
                  message={message}
                  onmessagedelete={handleDeleteMessage}
                />
              ))}
            </div>
          )}
        </div>

        {/* Suggest Messages */}
        <div className="gradient-card rounded-2xl border border-purple-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI Message Suggestions
          </h2>
          <p className="text-sm text-gray-500 mb-4">Get AI-generated message prompts to share with your audience</p>

          <Button
            onClick={fetchSuggestedMessages}
            disabled={suggestLoading}
            className="gradient-primary text-white border-0 hover:opacity-90 gap-2"
          >
            {suggestLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Sparkles className="h-4 w-4" />
            Generate Suggestions
          </Button>

          {suggestedMessages.length > 0 && (
            <div className="mt-5 flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Click to copy</p>
              {suggestedMessages.map((msg, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-purple-50 border border-purple-100 rounded-xl cursor-pointer hover:bg-purple-100 hover:border-purple-200 transition-all text-sm text-gray-700 group"
                  onClick={() => {
                    navigator.clipboard.writeText(msg);
                    toast.success('Copied to clipboard');
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span>{msg}</span>
                    <Copy className="h-3.5 w-3.5 text-purple-400 group-hover:text-purple-600 shrink-0 mt-0.5 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}