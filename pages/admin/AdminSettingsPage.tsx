import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  User, Bell, Shield, Palette, Key, Lock, Globe, Smartphone,
  Save, Camera, LogOut, AlertTriangle, Check, Crown, Activity,
  Database, Server, Zap, Clock, Eye, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';

type AdminSettingsTab = 'profile' | 'security' | 'notifications' | 'preferences' | 'audit';

export const AdminSettingsPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<AdminSettingsTab>('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile' as AdminSettingsTab, label: 'Admin Profile', icon: User },
    { id: 'security' as AdminSettingsTab, label: 'Security', icon: Shield },
    { id: 'notifications' as AdminSettingsTab, label: 'Notifications', icon: Bell },
    { id: 'preferences' as AdminSettingsTab, label: 'Preferences', icon: Palette },
    { id: 'audit' as AdminSettingsTab, label: 'Audit Log', icon: FileText },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Admin Badge */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Crown className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Settings</h1>
            <p className="text-slate-500 mt-1">Manage your administrator account</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-white">
          {saved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-yellow-500 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Admin Since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Actions Today</span>
                <span className="font-medium text-green-600">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Login</span>
                <span className="font-medium">2h ago</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <AdminProfileSettings user={user} />}
          {activeTab === 'security' && <AdminSecuritySettings />}
          {activeTab === 'notifications' && <AdminNotificationSettings />}
          {activeTab === 'preferences' && <AdminPreferencesSettings />}
          {activeTab === 'audit' && <AdminAuditLog />}
        </div>
      </div>
    </div>
  );
};

// Admin Profile Settings
const AdminProfileSettings = ({ user }: { user: any }) => {
  const [formData, setFormData] = useState({
    name: user?.name || 'Sarah Admin',
    email: user?.email || 'admin@geminiapp.com',
    phone: '+1 234 567 8900',
    department: 'Platform Operations',
    adminId: 'ADM-2024-001',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Only JPG, PNG or GIF files are allowed');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Profile Card */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-slate-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Admin Profile" 
                  className="h-24 w-24 rounded-full object-cover border-4 border-yellow-400/50 shadow-lg"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {formData.name.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1.5 shadow">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-0 right-0 p-1.5 bg-white dark:bg-slate-700 rounded-full shadow-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <Camera className="h-3 w-3 text-slate-600 dark:text-slate-300" />
              </button>
              {profileImage && (
                <button 
                  onClick={handleRemoveImage}
                  className="absolute top-0 left-0 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <AlertTriangle className="h-3 w-3" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name}</h3>
                <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded-full">ADMIN</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">{formData.department}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-mono mt-1">{formData.adminId}</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 font-medium"
              >
                Change Photo
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your admin profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</label>
              <Input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Phone Number</label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Department</label>
              <Input 
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Overview</CardTitle>
          <CardDescription>Your current admin access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'User Management', granted: true },
              { name: 'Content Moderation', granted: true },
              { name: 'Dataset Management', granted: true },
              { name: 'System Config', granted: true },
              { name: 'Analytics Access', granted: true },
              { name: 'Security Settings', granted: true },
            ].map((perm, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">{perm.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Security Settings
const AdminSecuritySettings = () => {
  const [security, setSettings] = useState({
    twoFactor: true,
    sessionAlerts: true,
    ipWhitelist: false,
    apiAccess: true,
  });

  const toggleSetting = (key: keyof typeof security) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Admin accounts require strong passwords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Current Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">New Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Confirm Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Password must be at least 12 characters with uppercase, lowercase, numbers, and symbols.
          </div>
          <Button variant="outline">
            <Lock className="h-4 w-4 mr-2" /> Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Security Options */}
      <Card>
        <CardHeader>
          <CardTitle>Security Options</CardTitle>
          <CardDescription>Enhanced security for admin accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Required for admin accounts', icon: Key, required: true },
            { key: 'sessionAlerts', label: 'Login Alerts', desc: 'Get notified of new sign-ins', icon: Bell },
            { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict access to specific IPs', icon: Shield },
            { key: 'apiAccess', label: 'API Access', desc: 'Allow API key generation', icon: Zap },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-slate-900 flex items-center gap-2">
                    {item.label}
                    {item.required && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Required</span>}
                  </h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={security[item.key as keyof typeof security]} 
                onChange={() => !item.required && toggleSetting(item.key as keyof typeof security)}
                disabled={item.required}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your logged-in devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-slate-500" />
              <div>
                <p className="font-medium text-sm">Chrome on Windows</p>
                <p className="text-xs text-slate-500">Current session • Mumbai, India</p>
              </div>
            </div>
            <span className="text-xs text-green-600 font-medium">● Active now</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-slate-500" />
              <div>
                <p className="font-medium text-sm">Safari on MacBook</p>
                <p className="text-xs text-slate-500">Last active 1 day ago • Delhi, India</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="w-full">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out All Other Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Notification Settings
const AdminNotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    userReports: true,
    systemAlerts: true,
    securityAlerts: true,
    dailyDigest: true,
    weeklyReport: true,
    contentFlags: true,
    newUsers: false,
  });

  const toggleSetting = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Alerts</CardTitle>
          <CardDescription>Critical notifications for platform management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'userReports', label: 'User Reports', desc: 'Get notified when users report issues', priority: 'high' },
            { key: 'systemAlerts', label: 'System Alerts', desc: 'Server status and performance alerts', priority: 'high' },
            { key: 'securityAlerts', label: 'Security Alerts', desc: 'Suspicious activity and security events', priority: 'critical' },
            { key: 'contentFlags', label: 'Content Flags', desc: 'Flagged content requiring review', priority: 'medium' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                  {item.label}
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded",
                    item.priority === 'critical' && "bg-red-100 text-red-700",
                    item.priority === 'high' && "bg-orange-100 text-orange-700",
                    item.priority === 'medium' && "bg-yellow-100 text-yellow-700"
                  )}>
                    {item.priority}
                  </span>
                </h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <ToggleSwitch 
                checked={notifications[item.key as keyof typeof notifications]} 
                onChange={() => toggleSetting(item.key as keyof typeof notifications)} 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reports & Digests</CardTitle>
          <CardDescription>Scheduled summary reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'dailyDigest', label: 'Daily Digest', desc: 'Summary of daily platform activity' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Comprehensive weekly analytics' },
            { key: 'newUsers', label: 'New User Notifications', desc: 'Get notified when new users register' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">{item.label}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <ToggleSwitch 
                checked={notifications[item.key as keyof typeof notifications]} 
                onChange={() => toggleSetting(item.key as keyof typeof notifications)} 
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Preferences Settings
const AdminPreferencesSettings = () => {
  const [preferences, setPreferences] = useState({
    defaultView: 'dashboard',
    itemsPerPage: '25',
    timezone: 'IST',
    dateFormat: 'DD/MM/YYYY',
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Preferences</CardTitle>
          <CardDescription>Customize your admin experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Default Landing Page</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white"
              value={preferences.defaultView}
              onChange={(e) => setPreferences({...preferences, defaultView: e.target.value})}
            >
              <option value="dashboard">Admin Dashboard</option>
              <option value="users">User Management</option>
              <option value="questions">Question Management</option>
              <option value="analytics">Analytics</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Items Per Page</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white"
              value={preferences.itemsPerPage}
              onChange={(e) => setPreferences({...preferences, itemsPerPage: e.target.value})}
            >
              <option value="10">10 items</option>
              <option value="25">25 items</option>
              <option value="50">50 items</option>
              <option value="100">100 items</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Timezone</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white"
                value={preferences.timezone}
                onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
              >
                <option value="IST">India Standard Time (IST)</option>
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Date Format</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 bg-white"
                value={preferences.dateFormat}
                onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Customize your admin toolbar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Activity, label: 'View Analytics', active: true },
              { icon: Database, label: 'Manage Data', active: true },
              { icon: Server, label: 'System Status', active: true },
              { icon: Eye, label: 'View as User', active: false },
            ].map((action, i) => (
              <button
                key={i}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                  action.active
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <action.icon className={cn("h-6 w-6", action.active ? "text-yellow-600" : "text-slate-400")} />
                <span className={cn("text-xs font-medium", action.active ? "text-yellow-700" : "text-slate-500")}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Audit Log
const AdminAuditLog = () => {
  const auditLogs = [
    { action: 'Updated system settings', time: '2 hours ago', type: 'settings', ip: '192.168.1.1' },
    { action: 'Approved 12 user questions', time: '4 hours ago', type: 'content', ip: '192.168.1.1' },
    { action: 'Created dataset "AI Basics"', time: '5 hours ago', type: 'content', ip: '192.168.1.1' },
    { action: 'Flagged inappropriate content', time: '6 hours ago', type: 'moderation', ip: '192.168.1.1' },
    { action: 'Changed password', time: '1 day ago', type: 'security', ip: '192.168.1.2' },
    { action: 'Logged in from new device', time: '1 day ago', type: 'security', ip: '192.168.1.2' },
    { action: 'Exported user analytics', time: '2 days ago', type: 'data', ip: '192.168.1.1' },
    { action: 'Disabled user account #2847', time: '3 days ago', type: 'user', ip: '192.168.1.1' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-red-100 text-red-700';
      case 'settings': return 'bg-blue-100 text-blue-700';
      case 'content': return 'bg-green-100 text-green-700';
      case 'moderation': return 'bg-orange-100 text-orange-700';
      case 'data': return 'bg-purple-100 text-purple-700';
      case 'user': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Activity Audit Log</CardTitle>
            <CardDescription>Your recent admin actions</CardDescription>
          </div>
          <div className="flex gap-2">
            <select className="text-sm border rounded-lg px-3 py-1.5 bg-white">
              <option>All Types</option>
              <option>Security</option>
              <option>Content</option>
              <option>Settings</option>
            </select>
            <select className="text-sm border rounded-lg px-3 py-1.5 bg-white">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-sm text-slate-900">{log.action}</p>
                    <p className="text-xs text-slate-500">{log.time} • IP: {log.ip}</p>
                  </div>
                </div>
                <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getTypeColor(log.type))}>
                  {log.type}
                </span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            Load More
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Audit Data</CardTitle>
          <CardDescription>Download your activity logs</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Export as CSV
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Export as PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
  <label className={cn("relative inline-flex items-center", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
    <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="sr-only peer" />
    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
  </label>
);

export default AdminSettingsPage;
