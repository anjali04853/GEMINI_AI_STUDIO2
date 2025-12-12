import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAdminStore } from '../../store/adminStore';
import { 
  Mail, Shield, Crown, Users, HelpCircle, Database,
  Activity, Clock, CheckCircle, AlertTriangle, Settings, Eye, Edit3,
  BarChart2, FileText, Lock, Key, Smartphone, Globe, Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

type AdminTabType = 'overview' | 'platform' | 'content' | 'analytics' | 'tools';

export const AdminProfilePage = () => {
  const { user } = useAuthStore();
  const { users, questions, datasets, reports } = useAdminStore();
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');

  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;

  const adminStats = [
    { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'text-brand-turquoise' },
    { label: 'Active Today', value: activeUsers.toString(), icon: Activity, color: 'text-green-500' },
    { label: 'Flagged', value: pendingReports.toString(), icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'Questions', value: questions.length.toString(), icon: HelpCircle, color: 'text-brand-purple' },
    { label: 'Datasets', value: datasets.length.toString(), icon: Database, color: 'text-brand-pink' },
    { label: 'Uptime', value: '98.5%', icon: Server, color: 'text-green-500' },
  ];

  const tabs: { id: AdminTabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'platform', label: 'Platform Activity' },
    { id: 'content', label: 'Content Stats' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'tools', label: 'Tools & Permissions' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Admin Profile Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-500/50 flex items-center justify-center text-3xl font-bold shadow-xl">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1.5 shadow-lg">
                <Crown className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-bold">{user?.name || 'Sarah Admin'}</h1>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">ADMIN</span>
              </div>
              <p className="text-slate-300">Platform Administrator</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm text-slate-400">
                <Mail className="h-4 w-4" />
                <span>{user?.email || 'admin@skillforge.com'}</span>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm text-slate-400">
                <Shield className="h-4 w-4" />
                <span>Admin since January 2024</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-0">
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-0">
                <BarChart2 className="h-4 w-4 mr-2" /> Dashboard
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 border-0">
                <Eye className="h-4 w-4 mr-2" /> View as User
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
            {adminStats.map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                <stat.icon className={cn("h-5 w-5 mx-auto mb-1", stat.color)} />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                activeTab === tab.id ? "border-yellow-500 text-yellow-600" : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && <AdminOverviewTab />}
        {activeTab === 'platform' && <PlatformActivityTab />}
        {activeTab === 'content' && <ContentStatsTab />}
        {activeTab === 'analytics' && <AdminAnalyticsTab />}
        {activeTab === 'tools' && <ToolsPermissionsTab />}
      </div>
    </div>
  );
};

const AdminOverviewTab = () => {
  const recentActions = [
    { action: 'Approved 12 user questions', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500' },
    { action: 'Created dataset "AI Basics"', time: '4 hours ago', icon: Database, color: 'text-brand-purple' },
    { action: 'Flagged inappropriate content', time: '5 hours ago', icon: AlertTriangle, color: 'text-orange-500' },
    { action: 'Reviewed user report #2847', time: '1 day ago', icon: FileText, color: 'text-brand-turquoise' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin Details</CardTitle>
          <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Role:</span><span className="font-medium">Super Administrator</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Permissions:</span><span className="font-medium text-green-600">Full Access</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Admin ID:</span><span className="font-mono">ADM-2024-001</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Last Login:</span><span>Today at 9:30 AM</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Two-Factor:</span><span className="text-green-600">✅ Enabled</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Recent Actions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {recentActions.map((action, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <action.icon className={cn("h-4 w-4", action.color)} />
              <span className="flex-1">{action.action}</span>
              <span className="text-slate-400 text-xs">{action.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};


const PlatformActivityTab = () => {
  const todayStats = [
    { label: 'Active users', value: '450', icon: Users },
    { label: 'Sessions', value: '1,247', icon: CheckCircle },
    { label: 'Quizzes', value: '342', icon: HelpCircle },
    { label: 'Voice interviews', value: '89', icon: Activity },
  ];

  const systemHealth = [
    { label: 'Server Status', value: 'Operational', status: 'good' },
    { label: 'API Response', value: '98ms', status: 'good' },
    { label: 'Database', value: 'Healthy', status: 'good' },
    { label: 'Storage', value: '72%', status: 'warning' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>User Activity Today</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {todayStats.map((stat, i) => (
              <div key={i} className="text-center p-4 bg-slate-50 rounded-xl">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-brand-purple" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {systemHealth.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", item.status === 'good' ? "bg-green-500" : "bg-yellow-500")} />
                <span className="text-sm">{item.value}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const ContentStatsTab = () => {
  const questionBreakdown = [
    { type: 'Multiple Choice', count: 189, percent: 55 },
    { type: 'Text Response', count: 87, percent: 25 },
    { type: 'Voice Response', count: 45, percent: 13 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Questions Created</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 text-sm">
            <span className="font-semibold">Total: 342</span>
            <span className="text-green-600">Active: 298</span>
            <span className="text-slate-400">Archived: 32</span>
          </div>
          <div className="space-y-2">
            {questionBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-32">{item.type}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-purple rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
                <span className="text-sm text-slate-500">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Moderation Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-600">567</p>
              <p className="text-sm text-green-600">Approved</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-red-600">89</p>
              <p className="text-sm text-red-600">Rejected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminAnalyticsTab = () => {
  const leaderboard = [
    { rank: 1, name: 'Sarah Admin (You)', actions: 1247, medal: '🥇' },
    { rank: 2, name: 'John SuperAdmin', actions: 1089, medal: '🥈' },
    { rank: 3, name: 'Mike Moderator', actions: 892, medal: '🥉' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>My Admin Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-1 px-4">
            {[25, 35, 42, 38, 45, 50, 48, 55, 52, 60, 58, 65, 62, 70, 68, 75, 72, 80, 78, 85, 82, 90, 88, 95, 92, 98, 95, 100, 97, 105].map((value, i) => (
              <div key={i} className="flex-1">
                <div className="w-full bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-sm" style={{ height: `${value * 0.9}%` }} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Admin Leaderboard</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {leaderboard.map((admin, i) => (
            <div key={i} className={cn("flex items-center justify-between p-3 rounded-lg", admin.rank === 1 ? "bg-yellow-50 border border-yellow-200" : "bg-slate-50")}>
              <div className="flex items-center gap-3">
                <span className="text-2xl w-8">{admin.medal}</span>
                <span className={cn("font-medium", admin.rank === 1 && "text-yellow-700")}>{admin.name}</span>
              </div>
              <span className="font-bold">{admin.actions.toLocaleString()} actions</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const ToolsPermissionsTab = () => {
  const permissions = ['User Management', 'Content Moderation', 'Dataset Management', 'System Config', 'Analytics', 'Security'];
  const quickTools = [
    { icon: Users, label: 'Search Users' },
    { icon: HelpCircle, label: 'Create Question' },
    { icon: BarChart2, label: 'View Analytics' },
    { icon: Database, label: 'Create Dataset' },
    { icon: Settings, label: 'System Settings' },
    { icon: Shield, label: 'Security Audit' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>My Permissions</CardTitle><CardDescription>Role: Super Administrator</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {permissions.map((perm, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{perm}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Quick Tools</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {quickTools.map((tool, i) => (
              <Button key={i} variant="outline" className="justify-start h-auto py-3">
                <tool.icon className="h-4 w-4 mr-2 text-brand-purple" />
                {tool.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader><CardTitle>Security & Sessions</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Chrome on Windows</p>
                <p className="text-xs text-slate-500">Mumbai, India</p>
                <p className="text-xs text-green-600">● Active now</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1"><Lock className="h-4 w-4 mr-2" /> Logout All Sessions</Button>
            <Button variant="outline" className="flex-1"><Key className="h-4 w-4 mr-2" /> Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfilePage;
