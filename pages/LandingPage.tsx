import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code, Mic, BarChart2, CheckCircle, ChevronDown, ChevronUp, Users, Target, TrendingUp, Mail, Github, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-brand-offWhite overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-brand-purple rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">SkillForge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-purple/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-turquoise/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-brand-pink/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-lavender border border-brand-purple/10 text-brand-purple font-medium text-sm mb-8 animate-float">
            <span className="flex h-2 w-2 rounded-full bg-brand-purple mr-2"></span>
            AI-Powered Career Growth
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-turquoise">Future</span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
            Master technical skills, ace interviews, and get real-time feedback with our advanced AI coaching platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="cta" size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Cards Illustration */}
        <div className="mt-20 max-w-5xl mx-auto px-4 hidden lg:block">
           <div className="grid grid-cols-3 gap-6 items-stretch">
              {/* Card 1: Quiz */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col animate-float" style={{ animationDelay: '0s' }}>
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Code size={20} /></div>
                    <div className="font-semibold text-slate-800">React Quiz</div>
                 </div>
                 <div className="space-y-2 flex-grow">
                    <div className="h-2 bg-slate-100 rounded-full w-3/4"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-1/2"></div>
                 </div>
                 <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                    <span>Score: 92%</span>
                    <span className="text-green-500 font-bold">+12%</span>
                 </div>
              </div>

              {/* Card 2: Stats */}
              <div className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-brand-purple/10 flex flex-col animate-float" style={{ animationDelay: '1s' }}>
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple"><BarChart2 size={20} /></div>
                    <div className="font-semibold text-slate-800">Weekly Progress</div>
                 </div>
                 <div className="flex items-end justify-between h-24 gap-2 flex-grow">
                    {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
                       <div key={i} className="w-full bg-gradient-to-t from-brand-purple to-brand-turquoise rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                    ))}
                 </div>
              </div>

              {/* Card 3: Voice */}
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col animate-float" style={{ animationDelay: '2s' }}>
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Mic size={20} /></div>
                    <div className="font-semibold text-slate-800">Voice Analysis</div>
                 </div>
                 <div className="flex items-center gap-1 h-8 mb-2 flex-grow">
                    {[1,2,3,4,5,6].map(i => (
                       <div key={i} className="w-2 bg-orange-400 rounded-full" style={{ height: `${Math.random() * 20 + 10}px` }}></div>
                    ))}
                 </div>
                 <div className="text-xs text-slate-500">Confidence Level: High</div>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Why SkillForge?</h2>
              <p className="mt-4 text-slate-600">Complete toolkit for your professional journey</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {[
                 { title: "Smart Assessments", desc: "Adaptive quizzes that test your actual knowledge depth.", icon: Code, color: "bg-blue-100 text-blue-600" },
                 { title: "AI Interviewer", desc: "Real-time voice conversations with feedback.", icon: Bot, color: "bg-brand-purple/10 text-brand-purple" },
                 { title: "Deep Analytics", desc: "Track your growth with detailed performance metrics.", icon: BarChart2, color: "bg-green-100 text-green-600" }
              ].map((feature, i) => (
                 <div key={i} className="p-6 rounded-2xl bg-brand-offWhite border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                       <feature.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-brand-offWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get started in minutes and begin your journey to career excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                step: "01", 
                title: "Sign Up Free", 
                desc: "Create your account in seconds. No credit card required. Start your journey immediately with access to all core features." 
              },
              { 
                step: "02", 
                title: "Take Assessments", 
                desc: "Complete adaptive quizzes tailored to your skill level. Our AI analyzes your responses to identify strengths and areas for improvement." 
              },
              { 
                step: "03", 
                title: "Practice Interviews", 
                desc: "Engage in realistic voice-based interviews with our AI interviewer. Receive instant feedback on your communication, technical knowledge, and confidence." 
              },
              { 
                step: "04", 
                title: "Track Progress", 
                desc: "Monitor your growth with detailed analytics and insights. See your improvement over time and get personalized recommendations." 
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow h-full">
                  <div className="text-4xl font-extrabold text-brand-purple/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-brand-purple/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Professionals</h2>
            <p className="text-lg text-slate-600">See what our users are saying about their success</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer",
                company: "Tech Corp",
                content: "SkillForge transformed my interview preparation. The AI interviewer helped me identify weaknesses I didn't know I had. Landed my dream job at a FAANG company!",
                rating: 5
              },
              {
                name: "Michael Rodriguez",
                role: "Full Stack Developer",
                company: "StartupXYZ",
                content: "The adaptive assessments are incredible. They adjust to my skill level and provide challenging questions that actually prepare me for real interviews. Highly recommend!",
                rating: 5
              },
              {
                name: "Emily Johnson",
                role: "Frontend Developer",
                company: "Design Studio",
                content: "The analytics dashboard is a game-changer. I can see exactly where I'm improving and what areas need more work. My confidence has skyrocketed!",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-brand-offWhite p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <CheckCircle key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-purple to-brand-turquoise flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-brand-purple to-brand-turquoise text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Users", icon: Users },
              { number: "95%", label: "Success Rate", icon: Target },
              { number: "4.9/5", label: "Average Rating", icon: TrendingUp },
              { number: "10K+", label: "Interviews Completed", icon: MessageSquare }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <stat.icon className="h-12 w-12 mb-4 opacity-90" />
                <div className="text-5xl font-extrabold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know about SkillForge</p>
          </div>
          
          <FAQComponent />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-brand-offWhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who are already mastering their skills and acing interviews with SkillForge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="cta" size="lg" className="group">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-brand-purple rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">SkillForge</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                AI-powered platform for mastering technical skills, acing interviews, and accelerating your career growth.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><Link to="/assessments" className="text-slate-400 hover:text-white transition-colors text-sm">Assessments</Link></li>
                <li><Link to="/interview" className="text-slate-400 hover:text-white transition-colors text-sm">AI Interviewer</Link></li>
                <li><Link to="/analytics" className="text-slate-400 hover:text-white transition-colors text-sm">Analytics</Link></li>
                <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Tutorials</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Community</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} SkillForge. All rights reserved.
              </p>
              <p className="text-slate-400 text-sm mt-4 md:mt-0">
                Built with ❤️ for career-driven professionals
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// FAQ Component
const FAQComponent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is SkillForge really free to use?",
      answer: "Yes! SkillForge offers a free tier that includes access to assessments, AI interviews, and basic analytics. You can upgrade to our premium plan for advanced features, detailed insights, and priority support."
    },
    {
      question: "How accurate is the AI interviewer?",
      answer: "Our AI interviewer uses advanced natural language processing and voice analysis to provide realistic interview experiences. It evaluates your technical knowledge, communication skills, and confidence levels, giving you feedback comparable to real interview scenarios."
    },
    {
      question: "What programming languages and technologies are covered?",
      answer: "SkillForge covers a wide range of technologies including React, JavaScript, Python, Java, Node.js, SQL, system design, and more. We continuously add new topics based on industry trends and user feedback."
    },
    {
      question: "Can I track my progress over time?",
      answer: "Absolutely! Our analytics dashboard provides detailed insights into your performance, showing improvements in scores, interview confidence, and skill mastery. You can view progress over days, weeks, or months."
    },
    {
      question: "How do the adaptive assessments work?",
      answer: "Our AI analyzes your responses in real-time and adjusts the difficulty of subsequent questions. If you answer correctly, questions become more challenging. If you struggle, it provides easier questions to build foundational knowledge."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, we take data security seriously. All your assessments, interviews, and progress data are encrypted and stored securely. We never share your information with third parties. You can read more in our Privacy Policy."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-semibold text-slate-900 pr-8">{faq.question}</span>
            {openIndex === index ? (
              <ChevronUp className="h-5 w-5 text-slate-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-600 flex-shrink-0" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-6 pb-5 text-slate-600 leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};