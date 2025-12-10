import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { 
  User, Bell, Shield, Palette, Globe, Volume2, Eye, Moon, Sun,
  Save, Camera, Mail, Lock, Key, Smartphone, LogOut, Trash2,
  ChevronRight, Check, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';

type SettingsTab = 'account' | 'notifications' | 'appearance' | 'privacy' | 'accessibility';

export const SettingsPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'account' as SettingsTab, label: 'Account', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'appearance' as SettingsTab, label: 'Appearance', icon: Palette },
    { id: 'privacy' as SettingsTab, label: 'Privacy & Security', icon: Shield },
    { id: 'accessibility' as SettingsTab, label: 'Accessibility', icon: Eye },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences</p>
        </div>
        <Button onClick={handleSave}>
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
                        ? "bg-accent text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'account' && <AccountSettings user={user} />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'privacy' && <PrivacySettings />}
          {activeTab === 'accessibility' && <AccessibilitySettings />}
        </div>
      </div>
    </div>
  );
};

// Account Settings Tab
const AccountSettings = ({ user }: { user: any }) => {
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1 234 567 8900',
    bio: 'Software engineer passionate about AI and machine learning.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Only JPG, PNG or GIF files are allowed');
        return;
      }
      // Create preview URL
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
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative group">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="h-24 w-24 rounded-full object-cover border-4 border-brand-purple/20"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand-purple to-brand-turquoise flex items-center justify-center text-3xl font-bold text-white">
                  {formData.name.charAt(0)}
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <Camera className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </button>
              {profileImage && (
                <button 
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Camera className="h-4 w-4 mr-2" />
                Upload New Photo
              </Button>
              {profileImage && (
                <Button variant="ghost" size="sm" onClick={handleRemoveImage} className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
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
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Location</label>
              <Input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Bio</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple resize-none"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Website</label>
            <Input 
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password regularly for security</CardDescription>
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
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Confirm New Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button variant="outline">
            <Lock className="h-4 w-4 mr-2" /> Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
            <div>
              <h4 className="font-medium text-slate-900">Delete Account</h4>
              <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Notification Settings Tab
const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    weeklyDigest: true,
    achievementAlerts: true,
    reminderEmails: false,
    marketingEmails: false,
    pushNotifications: true,
    soundEffects: true,
    desktopNotifications: false,
  });

  const toggleSetting = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage what emails you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'emailUpdates', label: 'Product Updates', desc: 'News about new features and improvements' },
            { key: 'weeklyDigest', label: 'Weekly Progress Digest', desc: 'Summary of your weekly activity and progress' },
            { key: 'achievementAlerts', label: 'Achievement Alerts', desc: 'Get notified when you earn badges' },
            { key: 'reminderEmails', label: 'Practice Reminders', desc: 'Reminders to keep your streak going' },
            { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Tips, offers, and promotional content' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">{item.label}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
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
          <CardTitle className="dark:text-white">App Notifications</CardTitle>
          <CardDescription>In-app notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
            { key: 'soundEffects', label: 'Sound Effects', desc: 'Play sounds for achievements and alerts' },
            { key: 'desktopNotifications', label: 'Desktop Notifications', desc: 'Show notifications on your desktop' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">{item.label}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
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

// Appearance Settings Tab
const AppearanceSettings = () => {
  const { theme, accentColor, setTheme, setAccentColor } = useThemeStore();

  const colors = [
    { name: 'purple' as const, class: 'bg-brand-purple' },
    { name: 'turquoise' as const, class: 'bg-brand-turquoise' },
    { name: 'pink' as const, class: 'bg-brand-pink' },
    { name: 'blue' as const, class: 'bg-blue-500' },
    { name: 'green' as const, class: 'bg-green-500' },
    { name: 'orange' as const, class: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light' as const, label: 'Light', icon: Sun },
              { id: 'dark' as const, label: 'Dark', icon: Moon },
              { id: 'system' as const, label: 'System', icon: Smartphone },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                  theme === option.id
                    ? "border-accent bg-accent-light"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500"
                )}
              >
                <option.icon className={cn("h-6 w-6", theme === option.id ? "text-accent" : "text-slate-400")} />
                <span className={cn("text-sm font-medium", theme === option.id ? "text-accent" : "text-slate-600 dark:text-slate-300")}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            {theme === 'system' ? 'Theme will follow your system preferences' : `Currently using ${theme} mode`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accent Color</CardTitle>
          <CardDescription>Personalize your interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setAccentColor(color.name)}
                className={cn(
                  "h-10 w-10 rounded-full transition-all",
                  color.class,
                  accentColor === color.name ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 dark:ring-offset-slate-800 scale-110" : "hover:scale-105"
                )}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 capitalize">
            Current Accent: {accentColor}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
          <CardDescription>Set your preferred language and timezone</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Language</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Hindi</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Timezone</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white">
              <option>Pacific Time (PT)</option>
              <option>Mountain Time (MT)</option>
              <option>Central Time (CT)</option>
              <option>Eastern Time (ET)</option>
              <option>India Standard Time (IST)</option>
              <option>UTC</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Privacy Settings Tab
const PrivacySettings = () => {
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showActivity: true,
    showProgress: false,
    twoFactor: false,
    sessionAlerts: true,
  });

  const toggleSetting = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>Control who can see your information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'profilePublic', label: 'Public Profile', desc: 'Allow others to view your profile' },
            { key: 'showActivity', label: 'Show Activity Status', desc: 'Let others see when you\'re online' },
            { key: 'showProgress', label: 'Share Progress', desc: 'Display your learning progress publicly' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">{item.label}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <ToggleSwitch 
                checked={privacy[item.key as keyof typeof privacy]} 
                onChange={() => toggleSetting(item.key as keyof typeof privacy)} 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Protect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-brand-purple" />
              <div>
                <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                <p className="text-sm text-slate-500">Add an extra layer of security</p>
              </div>
            </div>
            <ToggleSwitch 
              checked={privacy.twoFactor} 
              onChange={() => toggleSetting('twoFactor')} 
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <h4 className="font-medium text-slate-900">Login Alerts</h4>
                <p className="text-sm text-slate-500">Get notified of new sign-ins</p>
              </div>
            </div>
            <ToggleSwitch 
              checked={privacy.sessionAlerts} 
              onChange={() => toggleSetting('sessionAlerts')} 
            />
          </div>
        </CardContent>
      </Card>

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
            <span className="text-xs text-green-600 font-medium">Active now</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-slate-500" />
              <div>
                <p className="font-medium text-sm">Safari on iPhone</p>
                <p className="text-xs text-slate-500">Last active 2 hours ago</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="w-full mt-2">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out All Other Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Accessibility Settings Tab
const AccessibilitySettings = () => {
  const [settings, setSettings] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visual</CardTitle>
          <CardDescription>Adjust visual settings for better accessibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'reducedMotion', label: 'Reduce Motion', desc: 'Minimize animations and transitions' },
            { key: 'highContrast', label: 'High Contrast', desc: 'Increase contrast for better visibility' },
            { key: 'largeText', label: 'Large Text', desc: 'Increase default text size' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">{item.label}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <ToggleSwitch 
                checked={settings[item.key as keyof typeof settings]} 
                onChange={() => toggleSetting(item.key as keyof typeof settings)} 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audio</CardTitle>
          <CardDescription>Configure audio feedback settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-brand-purple" />
              <div>
                <h4 className="font-medium text-slate-900">Screen Reader Support</h4>
                <p className="text-sm text-slate-500">Optimize for screen readers</p>
              </div>
            </div>
            <ToggleSwitch 
              checked={settings.screenReader} 
              onChange={() => toggleSetting('screenReader')} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
          <CardDescription>Quick navigation shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {[
              { keys: ['Ctrl', 'K'], action: 'Open command palette' },
              { keys: ['Ctrl', '/'], action: 'Toggle sidebar' },
              { keys: ['Ctrl', 'S'], action: 'Save changes' },
              { keys: ['Esc'], action: 'Close modal/dialog' },
            ].map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">{shortcut.action}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, j) => (
                    <kbd key={j} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono">
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
  </label>
);

export default SettingsPage;
