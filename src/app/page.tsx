import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Target,
  TrendingUp,
  FileText,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AUTH_TOKEN_KEY } from "@/lib/cookies";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get(AUTH_TOKEN_KEY)?.value;
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Knowledge Base",
      description:
        "Upload your projects, resumes, and case studies. The system learns your company's unique capabilities.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Matching",
      description:
        "Get instant skill match scores, experience relevance, and win probability predictions.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Proposals",
      description:
        "Generate personalized proposals that reference your actual past projects in seconds.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Win Analytics",
      description:
        "Track what works and continuously improve your win rate with data-driven insights.",
    },
  ];

  const stats = [
    { value: "10x", label: "Faster Proposals" },
    { value: "3x", label: "Higher Response Rate" },
    { value: "50%", label: "Time Saved" },
    { value: "15%+", label: "Win Rate" },
  ];

  const pricingPlans = [
    {
      name: "Solo",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "5 proposals/month",
        "1 user",
        "10 document uploads",
        "Basic generation",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Freelancer Pro",
      price: "$29",
      period: "/month",
      description: "For serious freelancers",
      features: [
        "50 proposals/month",
        "1 user",
        "100 documents",
        "All core features",
        "Email support",
      ],
      cta: "Start Trial",
      popular: false,
    },
    {
      name: "Small Agency",
      price: "$99",
      period: "/month",
      description: "For growing teams",
      features: [
        "200 proposals/month",
        "5 users",
        "Unlimited documents",
        "Analytics dashboard",
        "Priority support",
      ],
      cta: "Start Trial",
      popular: true,
    },
    {
      name: "Agency Pro",
      price: "$299",
      period: "/month",
      description: "For large agencies",
      features: [
        "Unlimited proposals",
        "20 users",
        "All integrations",
        "Dedicated manager",
        "Custom AI training",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-xl font-semibold text-slate-900">
                ProposalIQ
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Pricing
              </a>
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      data-testid="nav-signup-btn"
                    >
                      Dashboard
                    </Button>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link href="/signup">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      data-testid="nav-signup-btn"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Proposal Intelligence
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Your company&apos;s memory + AI ={" "}
                <span className="gradient-text">Winning proposals</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-xl">
                Stop spending hours on proposals. ProposalIQ analyzes your
                knowledge base and generates high-conversion proposals with
                data-driven win predictions in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-base px-8 w-full sm:w-auto"
                    data-testid="hero-get-started-btn"
                  >
                    Start Free <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 w-full sm:w-auto"
                    data-testid="hero-see-how-btn"
                  >
                    See How It Works
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative animate-slide-up stagger-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <Image
                  src="https://images.pexels.com/photos/17483867/pexels-photo-17483867.jpeg"
                  alt="ProposalIQ Dashboard"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 to-transparent"></div>
              </div>
              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-slate-200 animate-fade-in stagger-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">87%</p>
                    <p className="text-sm text-slate-600">Match Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-heading text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to win more contracts
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From knowledge management to AI-powered proposal generation,
              ProposalIQ handles it all.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-slate-200 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600">
              Three simple steps to winning proposals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Knowledge",
                description:
                  "Add your past projects, resumes, and case studies. We'll extract skills and experience automatically.",
              },
              {
                step: "02",
                title: "Paste Job Description",
                description:
                  "Copy any job posting. Get instant skill matching, win probability, and budget estimates.",
              },
              {
                step: "03",
                title: "Generate & Send",
                description:
                  "Get AI-written proposals that reference your actual work. Edit, customize, and win.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-heading font-black text-slate-100 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-600">
              Start free, scale as you grow
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-xl p-6 border ${
                  plan.popular
                    ? "border-blue-600 ring-2 ring-blue-600"
                    : "border-slate-200"
                } card-hover`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-slate-600">{plan.period}</span>
                  )}
                </div>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-slate-900 hover:bg-slate-800"
                    }`}
                    data-testid={`pricing-${plan.name
                      .toLowerCase()
                      .replace(" ", "-")}-btn`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to win more contracts?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Join hundreds of agencies already using ProposalIQ to save time and
            win more.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-base px-8"
              data-testid="cta-start-free-btn"
            >
              Start Free Today <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-lg font-semibold text-white">
                ProposalIQ
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2025 ProposalIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
