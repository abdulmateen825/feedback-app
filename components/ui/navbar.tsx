'use client';

import React from 'react';
import NextLink from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './button';
import { MessageCircle, LogOut, User2 } from 'lucide-react';

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-purple-100/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NextLink href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">Mystery Message</span>
          </NextLink>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                <div className="hidden sm:flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-3 py-1.5">
                  <User2 className="h-3.5 w-3.5 text-purple-500" />
                  <span className="text-sm font-medium text-purple-700">
                    {user?.username || user?.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <NextLink href="/sign-in">
                  <Button variant="ghost" size="sm" className="text-purple-700 hover:bg-purple-50">
                    Sign In
                  </Button>
                </NextLink>
                <NextLink href="/sign-up">
                  <Button size="sm" className="gradient-primary text-white border-0 hover:opacity-90 glow-primary">
                    Get Started
                  </Button>
                </NextLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;