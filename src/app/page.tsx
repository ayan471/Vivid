"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Presentation,
  Sparkles,
  Wand2,
  Zap,
  ArrowUpRight,
  Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-white selection:bg-white selection:text-black"
    >
      {/* Background Patterns */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 rotate-45 scale-0 bg-white transition-transform duration-300 group-hover:scale-100" />
              <Presentation className="h-6 w-6 text-white relative transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-bold text-xl tracking-tight">Vivid</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="hover:text-gray-300 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-gray-300 transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              className="hover:text-gray-300 transition-colors"
            >
              Pricing
            </Link>
            <Button
              asChild
              variant="outline"
              className="border-white/25 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <Link href={"/dashboard"}>Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge
              variant="outline"
              className="border-white/20 text-white mb-6 py-2 px-4 text-sm backdrop-blur-sm"
            >
              AI-Powered Presentations
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1]">
              Create Stunning
              <span className="block mt-2 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                Presentations with AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Transform your ideas into professional presentations in minutes
              with our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-white/25 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300 group"
              >
                <Link href={"/dashboard"}>Start Creating</Link>
                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-14 px-8 text-lg text-white hover:bg-white/10 group"
              >
                <Play className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Floating Mockup */}
          <motion.div
            style={{ y }}
            className="mt-16 relative max-w-4xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-lg blur" />
            <Image
              src="/Hero.png"
              width={1200}
              height={675}
              alt="Vivid Interface"
              className="relative rounded-lg border border-white/10 shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to create professional presentations
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="p-8 bg-white/[0.03] border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <feature.icon className="h-12 w-12 text-white mb-6 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Create presentations in three simple steps
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative group"
              >
                <div className="mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
                    <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center border border-white/10 relative">
                      <span className="text-3xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              One plan. All features. No compromises.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <Card className="p-12 bg-white/[0.03] border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">Premium</h3>
                  <div className="mb-6">
                    <span className="text-6xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                      $97
                    </span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-14 text-lg border-white/25 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300"
                  >
                    Get Started <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-5">
                  {premiumFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-300 group/item"
                    >
                      <CheckCircle className="h-5 w-5 text-white mr-3 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied users
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 bg-white/[0.03] border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                      {testimonial.content}
                    </p>
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full relative"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.05] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Create Amazing Presentations?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of users who are already creating stunning
              presentations with AI
            </p>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg border-white/25 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300 group"
            >
              Get Started Now
              <ArrowUpRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center space-x-2 group mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rotate-45 scale-0 bg-white transition-transform duration-300 group-hover:scale-100" />
                  <Presentation className="h-6 w-6 text-white relative transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="font-bold text-xl tracking-tight">Vivid</span>
              </Link>
              <p className="text-gray-400">
                Create stunning presentations with the power of AI
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Vivid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "AI Content Generation",
    description:
      "Generate professional content and layouts automatically with our advanced AI",
    icon: Sparkles,
  },
  {
    title: "Smart Templates",
    description:
      "Choose from hundreds of AI-optimized templates for any presentation need",
    icon: Presentation,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time with smart collaboration features",
    icon: Wand2,
  },
  {
    title: "Instant Design",
    description: "Transform your ideas into visually stunning slides instantly",
    icon: Zap,
  },
  {
    title: "Custom Branding",
    description:
      "Maintain brand consistency with custom colors, fonts, and logos",
    icon: Presentation,
  },
  {
    title: "Export Anywhere",
    description:
      "Export your presentations in multiple formats for any platform",
    icon: ArrowRight,
  },
];

const steps = [
  {
    title: "Input Your Content",
    description:
      "Simply enter your topic or upload your content, and let our AI understand your needs",
  },
  {
    title: "AI Generation",
    description:
      "Our AI automatically creates professional slides with optimal layout and design",
  },
  {
    title: "Customize & Export",
    description:
      "Fine-tune your presentation and export it in your preferred format",
  },
];

const premiumFeatures = [
  "Unlimited AI-generated presentations",
  "Access to all premium templates",
  "Advanced AI content generation",
  "Custom branding and themes",
  "Real-time collaboration",
  "Priority support",
  "Export in all formats",
  "Analytics and insights",
  "API access",
  "99.9% uptime SLA",
];

const testimonials = [
  {
    content:
      "Vivid has revolutionized how we create presentations. What used to take hours now takes minutes!",
    name: "Sarah Johnson",
    role: "Marketing Director",
    avatar: "/sarah.jpg",
  },
  {
    content:
      "The AI-powered features are incredible. The quality of the presentations is consistently impressive.",
    name: "Michael Chen",
    role: "Product Manager",
    avatar: "/michael.jpg",
  },
  {
    content:
      "As a startup founder, Vivid has saved me countless hours in creating investor presentations.",
    name: "Emily Rodriguez",
    role: "CEO",
    avatar: "/emily.jpg",
  },
];
