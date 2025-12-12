import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Code, Mic, BarChart2 } from 'lucide-react';
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
    </div>
  );
};