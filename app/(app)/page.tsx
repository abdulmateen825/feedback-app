import Link from 'next/link';
import { MessageCircle, Shield, Zap, Lock, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Fully Anonymous',
    description: 'Senders stay completely anonymous. No accounts required to send messages.',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Messages arrive in real-time. Share your link and start receiving instantly.',
  },
  {
    icon: Lock,
    title: 'Private & Secure',
    description: 'Only you can see your messages. Full control over who can contact you.',
  },
];

const testimonials = [
  { text: "Finally a platform where I can get honest feedback without filters!", author: "@alex_designs" },
  { text: "My followers love sending me anonymous thoughts. It's so fun!", author: "@maya_creates" },
  { text: "Perfect for getting genuine opinions from friends.", author: "@jordan_tech" },
];

export default function Home() {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full" style={{background: 'radial-gradient(circle, oklch(0.78 0.12 290 / 0.4) 0%, transparent 70%)'}} />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full" style={{background: 'radial-gradient(circle, oklch(0.75 0.14 315 / 0.3) 0%, transparent 70%)'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{background: 'radial-gradient(circle, oklch(0.82 0.08 270 / 0.15) 0%, transparent 70%)'}} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-24 sm:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 border border-purple-200 rounded-full px-4 py-1.5 text-sm font-medium text-purple-700 mb-8 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Anonymous messaging, reimagined
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text">Honest messages,</span>
            <br />
            <span className="text-gray-900">no identity required</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create your profile, share your link, and let people send you genuine anonymous thoughts — completely safe and private.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 gradient-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all glow-primary shadow-lg"
            >
              Start for free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 bg-white/80 border border-purple-200 text-purple-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:border-purple-300 transition-all shadow-sm"
            >
              Sign in
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-gray-400">Join thousands already receiving anonymous messages</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Everything you need</h2>
        <p className="text-center text-gray-500 mb-12">Simple, powerful, and completely private</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="gradient-card rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-md">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What people are saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ text, author }) => (
            <div key={author} className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">&ldquo;{text}&rdquo;</p>
              <p className="text-purple-600 text-sm font-medium">{author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="gradient-primary rounded-3xl p-10 text-center text-white shadow-xl glow-primary">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-3">Ready to receive your first message?</h2>
          <p className="text-purple-100 mb-6 text-lg">It takes less than 30 seconds to set up.</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-md"
          >
            Create your profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 mt-8 py-8 text-center text-sm text-gray-400">
        <p>© 2025 Mystery Message. Built with Next.js.</p>
      </footer>
    </div>
  );
}
