import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, Smartphone, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface SettingSection {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  settings: SettingItem[];
}

interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: "toggle" | "select" | "action";
  value?: boolean | string;
  options?: string[];
}

const settingSections: SettingSection[] = [
  {
    title: "Notifications",
    icon: Bell,
    settings: [
      {
        id: "push_notifications",
        label: "Push Notifications",
        description: "Receive alerts for price movements and AI predictions",
        type: "toggle",
        value: true
      },
      {
        id: "prediction_alerts",
        label: "Prediction Updates",
        description: "Get notified when AI predictions change significantly",
        type: "toggle",
        value: true
      },
      {
        id: "market_alerts",
        label: "Market Alerts",
        description: "Receive alerts for major market events and volatility",
        type: "toggle",
        value: false
      }
    ]
  },
  {
    title: "AI & Analytics",
    icon: Database,
    settings: [
      {
        id: "model_complexity",
        label: "Model Complexity",
        description: "Higher complexity provides more accurate predictions but uses more resources",
        type: "select",
        value: "balanced",
        options: ["fast", "balanced", "accurate"]
      },
      {
        id: "historical_depth",
        label: "Historical Data Depth",
        description: "Amount of historical data to consider for predictions",
        type: "select",
        value: "6_months",
        options: ["3_months", "6_months", "1_year", "2_years"]
      },
      {
        id: "auto_update",
        label: "Auto-Update Models",
        description: "Automatically download and apply model updates",
        type: "toggle",
        value: true
      }
    ]
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    settings: [
      {
        id: "data_sharing",
        label: "Anonymous Analytics",
        description: "Help improve our AI models by sharing anonymous usage data",
        type: "toggle",
        value: false
      },
      {
        id: "biometric_auth",
        label: "Biometric Authentication",
        description: "Use fingerprint or face recognition to secure the app",
        type: "toggle",
        value: true
      },
      {
        id: "session_timeout",
        label: "Auto Lock",
        description: "Automatically lock the app after inactivity",
        type: "select",
        value: "15_min",
        options: ["never", "5_min", "15_min", "30_min", "1_hour"]
      }
    ]
  },
  {
    title: "Display & Interface",
    icon: Palette,
    settings: [
      {
        id: "theme",
        label: "App Theme",
        description: "Choose your preferred visual theme",
        type: "select",
        value: "dark",
        options: ["dark", "light", "auto"]
      },
      {
        id: "chart_style",
        label: "Chart Style",
        description: "Default chart visualization style",
        type: "select",
        value: "candlestick",
        options: ["line", "area", "candlestick"]
      },
      {
        id: "haptic_feedback",
        label: "Haptic Feedback",
        description: "Vibration feedback for interactions and alerts",
        type: "toggle",
        value: true
      }
    ]
  }
];

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const initialSettings: Record<string, boolean | string> = {};
    settingSections.forEach(section => {
      section.settings.forEach(setting => {
        if (setting.value !== undefined) {
          initialSettings[setting.id] = setting.value;
        }
      });
    });
    return initialSettings;
  });

  const handleToggle = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }));
  };

  const handleSelect = (settingId: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const formatSelectValue = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-surface pb-20 px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-secondary p-3 rounded-xl shadow-glow">
            <SettingsIcon className="w-6 h-6 text-secondary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your EquityPath AI experience</p>
      </motion.div>

      {/* Settings Sections */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * sectionIndex }}
          >
            <Card className="luxury-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <section.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
              </div>

              <div className="space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * settingIndex }}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium text-foreground">{setting.label}</h3>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>

                    <div className="ml-4">
                      {setting.type === "toggle" && (
                        <Switch
                          checked={settings[setting.id] as boolean}
                          onCheckedChange={() => handleToggle(setting.id)}
                        />
                      )}

                      {setting.type === "select" && setting.options && (
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-muted/50 px-3 py-1"
                        >
                          {formatSelectValue(settings[setting.id] as string)}
                        </Badge>
                      )}

                      {setting.type === "action" && (
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* App Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 space-y-4"
      >
        <Card className="luxury-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-secondary p-2 rounded-lg">
              <Smartphone className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">App Information</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Build</span>
              <span className="font-medium text-foreground">2024.01.15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">AI Model Version</span>
              <span className="font-medium text-primary">v2.3.1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Model Update</span>
              <span className="font-medium text-foreground">2 hours ago</span>
            </div>
          </div>
        </Card>

        {/* Support Actions */}
        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" className="justify-start py-4">
            <HelpCircle className="w-5 h-5 mr-3" />
            Help & Support
          </Button>
          <Button variant="outline" className="justify-start py-4">
            <Shield className="w-5 h-5 mr-3" />
            Privacy Policy
          </Button>
          <Button variant="outline" className="justify-start py-4">
            <Database className="w-5 h-5 mr-3" />
            Terms of Service
          </Button>
        </div>

        {/* Reset Button */}
        <Card className="luxury-card p-4 border border-destructive/20 bg-destructive/5">
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Reset Settings</h3>
            <p className="text-sm text-muted-foreground">
              Reset all settings to their default values. This action cannot be undone.
            </p>
            <Button variant="destructive" size="sm" className="w-full">
              Reset to Defaults
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;