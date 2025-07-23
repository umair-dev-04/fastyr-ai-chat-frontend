"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, MessageSquare, Brain, Lightbulb, Shield, Zap, BookOpen, HelpingHand } from "lucide-react"
import { motion } from "framer-motion"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "Answering Questions",
      description: "Get instant answers on general knowledge, science, history, and more",
    },
    {
      icon: <Brain className="h-8 w-8 text-green-600" />,
      title: "Information & Research",
      description: "Look up current events, weather, and comprehensive information on any topic",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Calculations & Analysis",
      description: "From basic arithmetic to complex math problems and data interpretation",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-orange-600" />,
      title: "Writing & Editing",
      description: "Help draft, edit, proofread documents and creative writing",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-orange-600" />,
      title: "Learning Support",
      description: "Get explanations and help with educational topics",
    },
    {
      icon: <HelpingHand className="h-8 w-8 text-orange-600" />,
      title: "Creative Assistance",
      description: "Brainstorm ideas and get creative writing help",
    },
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant responses to your questions and requests",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your conversations are encrypted and kept confidential",
    },
    {
      icon: Brain,
      title: "Always Learning",
      description: "Powered by advanced AI that continuously improves",
    },
  ]

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
              data-cy="logo"
            >
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">AI Assistant</span>
            </motion.div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button onClick={() => router.push("/chat")} className="bg-blue-600 hover:bg-blue-700">
                  Go to Chat
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push("/auth/login")} data-cy="login-btn">
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push("/auth/signup")}
                    className="bg-blue-600 hover:bg-blue-700"
                    data-cy="get-started-btn"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Your Intelligent
              <span className="text-blue-600 block">AI Assistant</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              data-cy="hero-description"
            >
              Get instant answers, solve complex problems, and boost your productivity with our advanced AI assistant.
              From answering questions to helping with calculations and writing - I'm here to help with everything.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => router.push(isAuthenticated ? "/chat" : "/auth/signup")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                {isAuthenticated ? "Start Chatting" : "Try It Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/demo")}
                className="text-lg px-8 py-3"
                data-cy="watch-demo-btn"
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20" data-cy="features-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need in an AI assistant</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI capabilities designed to help you with any task or question
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-cy="feature-card"
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">{feature.icon}</div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AI Assistant?</h2>
              <p className="text-xl text-gray-600">Built for efficiency, security, and continuous improvement</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-20" data-cy="cta-section">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl font-bold mb-4" data-cy="cta-title">
                Ready to experience the power of AI?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of users who rely on our AI assistant for answers, insights, and productivity
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push(isAuthenticated ? "/chat" : "/auth/signup")}
                className="text-lg px-8 py-3"
              >
                {isAuthenticated ? "Start Chatting" : "Get Started Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">AI Assistant</span>
              </div>
              <div className="text-gray-400">© 2025 AI Assistant. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  )
}
