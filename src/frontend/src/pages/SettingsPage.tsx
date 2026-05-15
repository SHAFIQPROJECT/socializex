import { createActor } from "@/backend";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import UserAvatar from "@/components/ui/UserAvatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Bot,
  CheckCircle2,
  Eye,
  EyeOff,
  Key,
  Lock,
  LogOut,
  Palette,
  Plus,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SettingsSection =
  | "profile"
  | "account"
  | "privacy"
  | "notifications"
  | "ai"
  | "appearance";

const SECTIONS: {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Lock },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "AI Settings", icon: Bot },
  { id: "appearance", label: "Appearance", icon: Palette },
];

interface ProfileFormValues {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
}

const ACCENT_COLORS = [
  { name: "Violet", hsl: "280", preview: "oklch(0.60 0.24 280)" },
  { name: "Cyan", hsl: "200", preview: "oklch(0.60 0.22 200)" },
  { name: "Pink", hsl: "330", preview: "oklch(0.60 0.22 330)" },
  { name: "Emerald", hsl: "160", preview: "oklch(0.60 0.20 160)" },
  { name: "Orange", hsl: "40", preview: "oklch(0.60 0.22 40)" },
  { name: "Rose", hsl: "10", preview: "oklch(0.60 0.22 10)" },
];

function ProfileSettings() {
  const { user, setUser } = useAuthStore();
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [socialLinks, setSocialLinks] = useState<string[]>(
    user?.socialLinks ?? [],
  );
  const [linkInput, setLinkInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      displayName: user?.displayName ?? "",
      username: user?.username ?? "",
      bio: user?.bio ?? "",
      avatarUrl: user?.avatarUrl ?? "",
      coverUrl: user?.coverUrl ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        coverUrl: user.coverUrl,
      });
      setSkills(user.skills);
      setSocialLinks(user.socialLinks);
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProfile(
        data.displayName,
        data.bio,
        data.avatarUrl,
        data.coverUrl,
        socialLinks,
        skills,
      );
    },
    onSuccess: (_, data) => {
      if (user) {
        setUser({ ...user, ...data, skills, socialLinks });
      }
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Profile updated!", { icon: "✨" });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  function addLink() {
    const l = linkInput.trim();
    if (l && !socialLinks.includes(l)) {
      setSocialLinks((prev) => [...prev, l]);
      setLinkInput("");
    }
  }

  function removeLink(link: string) {
    setSocialLinks((prev) => prev.filter((l) => l !== link));
  }

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-6"
      data-ocid="settings.profile_form"
    >
      {/* Avatar preview */}
      <div className="flex items-center gap-4">
        <UserAvatar
          src={user?.avatarUrl}
          name={user?.displayName}
          size="xl"
          ring
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground mb-1">
            {user?.displayName}
          </p>
          <p className="text-xs text-muted-foreground">@{user?.username}</p>
        </div>
      </div>

      <Separator className="bg-border/40" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="displayName"
            className="text-sm text-muted-foreground"
          >
            Display Name
          </Label>
          <Input
            id="displayName"
            {...register("displayName", { required: "Required" })}
            className="bg-muted/30 border-border/50 focus-visible:ring-primary/50"
            data-ocid="settings.display_name_input"
          />
          {errors.displayName && (
            <p
              className="text-xs text-destructive"
              data-ocid="settings.displayname_field_error"
            >
              {errors.displayName.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-sm text-muted-foreground">
            Username
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              @
            </span>
            <Input
              id="username"
              {...register("username", { required: "Required" })}
              className="bg-muted/30 border-border/50 pl-7 focus-visible:ring-primary/50"
              data-ocid="settings.username_input"
            />
          </div>
          {errors.username && (
            <p
              className="text-xs text-destructive"
              data-ocid="settings.username_field_error"
            >
              {errors.username.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio" className="text-sm text-muted-foreground">
          Bio
        </Label>
        <Textarea
          id="bio"
          {...register("bio")}
          rows={3}
          placeholder="Tell people about yourself..."
          className="bg-muted/30 border-border/50 focus-visible:ring-primary/50 resize-none"
          data-ocid="settings.bio_textarea"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="avatarUrl" className="text-sm text-muted-foreground">
            Avatar URL
          </Label>
          <Input
            id="avatarUrl"
            {...register("avatarUrl")}
            placeholder="https://..."
            className="bg-muted/30 border-border/50 focus-visible:ring-primary/50"
            data-ocid="settings.avatar_url_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coverUrl" className="text-sm text-muted-foreground">
            Cover Image URL
          </Label>
          <Input
            id="coverUrl"
            {...register("coverUrl")}
            placeholder="https://..."
            className="bg-muted/30 border-border/50 focus-visible:ring-primary/50"
            data-ocid="settings.cover_url_input"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">
          Skills & Interests
        </Label>
        <div
          className="flex flex-wrap gap-2 mb-2"
          data-ocid="settings.skills_list"
        >
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-destructive transition-neon"
                data-ocid="settings.skill_remove_button"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add skill or interest..."
            className="bg-muted/30 border-border/50 focus-visible:ring-primary/50"
            data-ocid="settings.skill_input"
          />
          <GradientButton
            type="button"
            variant="outline"
            size="sm"
            onClick={addSkill}
            data-ocid="settings.skill_add_button"
          >
            <Plus size={14} />
          </GradientButton>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Social Links</Label>
        <div className="space-y-2 mb-2" data-ocid="settings.social_links_list">
          {socialLinks.map((link, i) => (
            <div
              key={link}
              className="flex items-center gap-2 rounded-xl bg-muted/30 px-3 py-2"
            >
              <span className="flex-1 text-sm truncate text-foreground/80">
                {link}
              </span>
              <button
                type="button"
                onClick={() => removeLink(link)}
                className="text-muted-foreground hover:text-destructive transition-neon"
                data-ocid={`settings.social_link_remove.${i + 1}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLink();
              }
            }}
            placeholder="https://your-website.com"
            className="bg-muted/30 border-border/50 focus-visible:ring-primary/50"
            data-ocid="settings.social_link_input"
          />
          <GradientButton
            type="button"
            variant="outline"
            size="sm"
            onClick={addLink}
            data-ocid="settings.social_link_add_button"
          >
            <Plus size={14} />
          </GradientButton>
        </div>
      </div>

      <div className="pt-2">
        <GradientButton
          type="submit"
          loading={mutation.isPending}
          disabled={
            !isDirty &&
            skills === user?.skills &&
            socialLinks === user?.socialLinks
          }
          data-ocid="settings.profile_save_button"
        >
          <CheckCircle2 size={16} /> Save Profile
        </GradientButton>
      </div>
    </form>
  );
}

function AISettings() {
  const { actor } = useActor(createActor);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (actor) {
      actor
        .isMyOpenAIConfigured()
        .then(setIsConfigured)
        .catch(() => {});
    }
  }, [actor]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      const result = await actor.setMyOpenAIApiKey(apiKey);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      setIsConfigured(true);
      setApiKey("");
      toast.success("API key saved securely!", { icon: "🔐" });
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to save key"),
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      const result = await actor.clearMyOpenAIApiKey();
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      setIsConfigured(false);
      toast.success("API key removed");
    },
    onError: () => toast.error("Failed to remove key"),
  });

  return (
    <div className="space-y-6" data-ocid="settings.ai_section">
      <GlassCard className="p-4 border border-primary/20" animate>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/15">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              AI-Powered Features
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connect your OpenAI API key to unlock AI caption generation, smart
              hashtag suggestions, toxic comment detection, and the AI chatbot
              assistant.
            </p>
          </div>
        </div>
      </GlassCard>

      {isConfigured && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3"
          data-ocid="settings.ai_configured_state"
        >
          <CheckCircle2 size={16} className="text-green-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-400">
              OpenAI API key is configured
            </p>
            <p className="text-xs text-muted-foreground">
              AI features are active on your account
            </p>
          </div>
          <GradientButton
            variant="outline"
            size="sm"
            loading={clearMutation.isPending}
            onClick={() => clearMutation.mutate()}
            data-ocid="settings.ai_clear_button"
          >
            Remove
          </GradientButton>
        </motion.div>
      )}

      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground flex items-center gap-2">
          <Key size={14} /> OpenAI API Key
        </Label>
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              isConfigured ? "Enter new key to replace existing..." : "sk-..."
            }
            className="bg-muted/30 border-border/50 focus-visible:ring-primary/50 pr-10 font-mono text-sm"
            data-ocid="settings.ai_key_input"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-neon"
            data-ocid="settings.ai_key_toggle"
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Your key is stored encrypted and never shared with third parties.
        </p>
        <GradientButton
          type="button"
          loading={saveMutation.isPending}
          disabled={!apiKey.trim()}
          onClick={() => saveMutation.mutate()}
          data-ocid="settings.ai_save_button"
        >
          <Key size={16} /> Save API Key
        </GradientButton>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const [selectedColor, setSelectedColor] = useState("280");

  return (
    <div className="space-y-6" data-ocid="settings.appearance_section">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-1">
          Color Theme
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Choose your accent color across the app
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.hsl}
              type="button"
              onClick={() => setSelectedColor(color.hsl)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-neon cursor-pointer",
                selectedColor === color.hsl
                  ? "border-primary/60 bg-primary/10"
                  : "border-border/40 bg-muted/20 hover:border-primary/30 hover:bg-muted/40",
              )}
              data-ocid={`settings.color_${color.name.toLowerCase()}_button`}
            >
              <div
                className="h-8 w-8 rounded-full shadow-lg"
                style={{
                  background: color.preview,
                  boxShadow:
                    selectedColor === color.hsl
                      ? `0 0 12px ${color.preview}80`
                      : "none",
                }}
              />
              <span className="text-xs text-muted-foreground">
                {color.name}
              </span>
              {selectedColor === color.hsl && (
                <motion.div
                  layoutId="selected-color"
                  className="absolute inset-0 rounded-xl border-2 border-primary/60"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/40" />

      <div>
        <h3 className="text-sm font-medium text-foreground mb-1">
          Interface Density
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Control how compact the UI looks
        </p>
        <div className="flex gap-3">
          {["Comfortable", "Compact"].map((d, i) => (
            <button
              key={d}
              type="button"
              className={cn(
                "flex-1 rounded-xl border py-3 text-sm font-medium transition-neon",
                i === 0
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/40 bg-muted/20 text-muted-foreground hover:border-primary/30",
              )}
              data-ocid={`settings.density_${d.toLowerCase()}_button`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <p className="text-xs text-muted-foreground italic">
          Full theme customization coming soon ✨
        </p>
      </div>
    </div>
  );
}

function PrivacySettings() {
  const privacyOptions = [
    {
      label: "Private Account",
      desc: "Only approved followers can see your posts",
      enabled: false,
    },
    {
      label: "Show Online Status",
      desc: "Let others see when you're active",
      enabled: true,
    },
    {
      label: "Allow Tags",
      desc: "Allow others to tag you in posts",
      enabled: true,
    },
    {
      label: "Show Activity Status",
      desc: "Display your recent activity to followers",
      enabled: false,
    },
  ];

  return (
    <div className="space-y-4" data-ocid="settings.privacy_section">
      {privacyOptions.map((opt, i) => (
        <GlassCard
          key={opt.label}
          className="flex items-center justify-between p-4"
        >
          <div>
            <p className="text-sm font-medium text-foreground">{opt.label}</p>
            <p className="text-xs text-muted-foreground">{opt.desc}</p>
          </div>
          <label
            className="relative inline-flex items-center cursor-pointer"
            data-ocid={`settings.privacy_toggle.${i + 1}`}
          >
            <input
              type="checkbox"
              defaultChecked={opt.enabled}
              className="sr-only peer"
            />
            <div className="w-10 h-5 rounded-full bg-muted/60 peer-checked:bg-primary transition-neon after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-neon peer-checked:after:translate-x-5" />
          </label>
        </GlassCard>
      ))}
    </div>
  );
}

function NotificationSettings() {
  const notifOptions = [
    {
      label: "New Followers",
      desc: "Someone follows your profile",
      enabled: true,
    },
    { label: "Post Likes", desc: "Someone likes your post", enabled: true },
    { label: "Comments", desc: "Someone comments on your post", enabled: true },
    {
      label: "Mentions",
      desc: "Someone mentions you in a post",
      enabled: true,
    },
    { label: "Direct Messages", desc: "New message received", enabled: true },
    {
      label: "AI Insights",
      desc: "Weekly AI-generated analytics summary",
      enabled: false,
    },
  ];

  return (
    <div className="space-y-4" data-ocid="settings.notifications_section">
      {notifOptions.map((opt, i) => (
        <GlassCard
          key={opt.label}
          className="flex items-center justify-between p-4"
        >
          <div>
            <p className="text-sm font-medium text-foreground">{opt.label}</p>
            <p className="text-xs text-muted-foreground">{opt.desc}</p>
          </div>
          <label
            className="relative inline-flex items-center cursor-pointer"
            data-ocid={`settings.notif_toggle.${i + 1}`}
          >
            <input
              type="checkbox"
              defaultChecked={opt.enabled}
              className="sr-only peer"
            />
            <div className="w-10 h-5 rounded-full bg-muted/60 peer-checked:bg-primary transition-neon after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-neon peer-checked:after:translate-x-5" />
          </label>
        </GlassCard>
      ))}
    </div>
  );
}

function AccountSettings() {
  const { user, logout } = useAuthStore();

  return (
    <div className="space-y-6" data-ocid="settings.account_section">
      <GlassCard className="p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Account Information
        </h3>
        <Separator className="bg-border/30" />
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: "Principal ID", value: user?.id.toString() ?? "—" },
            {
              label: "Username",
              value: user?.username ? `@${user.username}` : "—",
            },
            {
              label: "Account Type",
              value: user?.isAdmin ? "Administrator" : "User",
            },
            {
              label: "Account Status",
              value: user?.isBanned ? "Suspended" : "Active",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
            >
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
              <span className="text-xs font-medium text-foreground truncate max-w-[60%] text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-4 border border-destructive/20">
        <h3 className="text-sm font-semibold text-destructive mb-2">
          Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Sign out from your account on this device.
        </p>
        <GradientButton
          variant="outline"
          onClick={() => logout()}
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          data-ocid="settings.logout_button"
        >
          <LogOut size={16} /> Sign Out
        </GradientButton>
      </GlassCard>
    </div>
  );
}

const SECTION_CONTENT: Record<SettingsSection, React.ComponentType> = {
  profile: ProfileSettings,
  account: AccountSettings,
  privacy: PrivacySettings,
  notifications: NotificationSettings,
  ai: AISettings,
  appearance: AppearanceSettings,
};

const SECTION_TITLES: Record<SettingsSection, { title: string; desc: string }> =
  {
    profile: {
      title: "Profile Settings",
      desc: "Update your public profile information",
    },
    account: {
      title: "Account",
      desc: "Manage your account details and security",
    },
    privacy: {
      title: "Privacy",
      desc: "Control who can see your content and activity",
    },
    notifications: {
      title: "Notifications",
      desc: "Customize what notifications you receive",
    },
    ai: { title: "AI Settings", desc: "Configure AI-powered features" },
    appearance: {
      title: "Appearance",
      desc: "Customize your visual experience",
    },
  };

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");
  const SectionContent = SECTION_CONTENT[activeSection];
  const { title, desc } = SECTION_TITLES[activeSection];

  return (
    <>
      <div
        className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto"
        data-ocid="settings.page"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold gradient-text mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:w-56 shrink-0"
          >
            <GlassCard className="p-2" data-ocid="settings.nav_sidebar">
              {SECTIONS.map((section, i) => (
                <motion.button
                  key={section.id}
                  type="button"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                  onClick={() => setActiveSection(section.id)}
                  data-ocid={`settings.nav_${section.id}_button`}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-neon text-left",
                    activeSection === section.id
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                  )}
                >
                  <section.icon size={16} className="shrink-0" />
                  {section.label}
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="settings-active"
                      className="ml-auto h-4 w-0.5 rounded-full bg-primary"
                    />
                  )}
                </motion.button>
              ))}
            </GlassCard>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 min-w-0"
          >
            <GlassCard className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      {title}
                    </h2>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <SectionContent />
                </motion.div>
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </>
  );
}
