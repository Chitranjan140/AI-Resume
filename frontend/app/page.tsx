'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Brain, Target, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Navbar } from '@/components/Navbar'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              AI-Powered Resume Analysis
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Get instant AI feedback on your resume, match with job descriptions, and discover your career potential
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={user ? "/dashboard" : "/auth/signup"} className="btn-primary">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="#features" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Everything you need to optimize your resume and land your dream job
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 text-center hover:scale-105 transition-transform duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Boost Your Career?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Join thousands of professionals who have improved their resumes with AI
            </p>
            <Link href={user ? "/dashboard" : "/auth/signup"} className="btn-primary text-lg px-8 py-4">
              Start Your Analysis <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Advanced AI analyzes your resume for skills, experience, and optimization opportunities"
  },
  {
    icon: Target,
    title: "Job Matching",
    description: "Compare your resume against job descriptions and get precise match scores"
  },
  {
    icon: TrendingUp,
    title: "Skill Insights",
    description: "Identify skill gaps and get personalized recommendations for career growth"
  },
  {
    icon: Users,
    title: "ATS Optimization",
    description: "Ensure your resume passes Applicant Tracking Systems with our ATS checker"
  }
]