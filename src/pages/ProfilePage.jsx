import { CheckCircle2, Github, Globe, Linkedin, MapPin, Save, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Field from "../components/forms/Field.jsx";
import SelectMenu from "../components/forms/SelectMenu.jsx";
import SkillInput from "../components/forms/SkillInput.jsx";
import Alert from "../components/ui/Alert.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Button from "../components/ui/Button.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserProfile, updateUserProfile } from "../services/firestore.js";
import { experienceLevels } from "../utils/constants.js";
import { getServiceErrorMessage, isValidUrl } from "../utils/messages.js";

const initialProfile = {
  fullName: "",
  username: "",
  bio: "",
  skills: [],
  experienceLevel: "Beginner",
  location: "",
  portfolioUrl: "",
  githubUrl: "",
  linkedinUrl: "",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const savedProfile = await getUserProfile(user.uid);
        if (!mounted) return;
        setProfile({
          ...initialProfile,
          fullName: savedProfile?.fullName || user.displayName || "",
          username: savedProfile?.username || "",
          bio: savedProfile?.bio || "",
          skills: savedProfile?.skills || [],
          experienceLevel: savedProfile?.experienceLevel || "Beginner",
          location: savedProfile?.location || "",
          portfolioUrl: savedProfile?.portfolioUrl || "",
          githubUrl: savedProfile?.githubUrl || "",
          linkedinUrl: savedProfile?.linkedinUrl || "",
        });
      } catch (err) {
        if (mounted) setError(getServiceErrorMessage(err, "Could not load profile."));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [user]);

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  const completionItems = [
    { label: "Name", done: profile.fullName.trim().length >= 2 },
    { label: "Username", done: profile.username.trim().length >= 3 },
    { label: "Bio", done: profile.bio.trim().length >= 20 },
    { label: "Skills", done: profile.skills.length > 0 },
    { label: "Location", done: Boolean(profile.location.trim()) },
    { label: "Links", done: [profile.portfolioUrl, profile.githubUrl, profile.linkedinUrl].some((value) => value.trim()) },
  ];
  const completedCount = completionItems.filter((item) => item.done).length;
  const completion = Math.round((completedCount / completionItems.length) * 100);
  const linkItems = [
    { label: "Portfolio", value: profile.portfolioUrl, icon: Globe },
    { label: "GitHub", value: profile.githubUrl, icon: Github },
    { label: "LinkedIn", value: profile.linkedinUrl, icon: Linkedin },
  ];

  function validateProfile() {
    if (profile.fullName.trim().length < 2) {
      return "Please enter your full name.";
    }

    if (!/^[a-zA-Z0-9_]{3,24}$/.test(profile.username.trim())) {
      return "Username must be 3-24 characters using letters, numbers, or underscores.";
    }

    const urls = [
      ["Portfolio URL", profile.portfolioUrl],
      ["GitHub URL", profile.githubUrl],
      ["LinkedIn URL", profile.linkedinUrl],
    ];

    const invalidUrl = urls.find(([, value]) => !isValidUrl(value));
    if (invalidUrl) {
      return `${invalidUrl[0]} must start with http:// or https://.`;
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationMessage = validateProfile();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSaving(true);

    try {
      await updateUserProfile(user.uid, {
        ...profile,
        fullName: profile.fullName.trim(),
        username: profile.username.trim(),
        bio: profile.bio.trim(),
        location: profile.location.trim(),
        portfolioUrl: profile.portfolioUrl.trim(),
        githubUrl: profile.githubUrl.trim(),
        linkedinUrl: profile.linkedinUrl.trim(),
        email: user.email,
      });
      toast.success("Profile saved.");
    } catch (err) {
      setError(getServiceErrorMessage(err, "Could not save profile."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading profile" />;
  }

  return (
    <main className="page-shell page-reveal py-6 sm:py-10">
      <section className="panel-soft glass-reflect mb-6 overflow-hidden p-5 sm:p-6">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/55 to-transparent" aria-hidden="true" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={profile.fullName} email={user.email} size="xl" />
            <div className="min-w-0">
              <p className="label text-mint">Profile</p>
              <h1 className="mt-2 break-words text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
                {profile.fullName || "Builder identity"}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/54">
                <span>@{profile.username || "username"}</span>
                <span className="rounded-full border border-white/[0.1] bg-white/[0.045] px-2.5 py-1 text-xs font-semibold text-white/56">
                  {profile.experienceLevel}
                </span>
                {profile.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} />
                    {profile.location}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-full rounded-lg border border-white/[0.12] bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:w-80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">Completion</p>
                <strong className="mt-1 block text-2xl font-black text-white">{completion}%</strong>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10 text-cyan">
                <ShieldCheck size={22} />
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan to-mint shadow-[0_0_24px_rgba(103,232,249,0.32)] transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/52">
              {completionItems.map((item) => (
                <span className="inline-flex items-center gap-1.5" key={item.label}>
                  <CheckCircle2 size={13} className={item.done ? "text-mint" : "text-white/22"} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <form className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]" onSubmit={handleSubmit} noValidate>
        <section className="panel grid gap-5 p-5 sm:p-6">
          {error ? <Alert variant="error">{error}</Alert> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input className="input" value={profile.fullName} onChange={(event) => updateField("fullName", event.target.value)} required />
            </Field>
            <Field label="Username">
              <input className="input" value={profile.username} onChange={(event) => updateField("username", event.target.value)} required />
            </Field>
          </div>

          <Field label="Bio">
            <textarea
              className="input min-h-32 resize-y"
              value={profile.bio}
              onChange={(event) => updateField("bio", event.target.value)}
              placeholder="What do you build and what kind of teams are you looking for?"
            />
          </Field>

          <SkillInput value={profile.skills} onChange={(skills) => updateField("skills", skills)} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Experience level">
              <SelectMenu label="Experience level" value={profile.experienceLevel} onChange={(value) => updateField("experienceLevel", value)} options={experienceLevels} />
            </Field>
            <Field label="Location">
              <input className="input" value={profile.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Your city" />
            </Field>
          </div>

          <Button type="submit" disabled={saving} className="w-full sm:w-auto sm:justify-self-start">
            <Save size={17} />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </section>

        <aside className="grid content-start gap-6">
          <section className="panel interactive-panel overflow-hidden p-5">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden="true" />
            <h2 className="font-semibold text-white">Profile preview</h2>
            <div className="mt-5 flex items-center gap-4">
              <Avatar name={profile.fullName} email={user.email} size="lg" />
              <div className="min-w-0">
                <h3 className="break-words font-semibold text-white">{profile.fullName || "Your name"}</h3>
                <p className="truncate text-sm text-white/46">@{profile.username || "username"}</p>
              </div>
            </div>
            <p className={`mt-5 text-sm leading-6 ${profile.bio ? "text-white/62" : "text-white/38"}`}>
              {profile.bio || "Add a concise builder bio to help owners understand your fit."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.skills.length ? (
                profile.skills.slice(0, 8).map((skill) => (
                  <span className="chip-strong" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-dashed border-white/[0.14] px-3 py-1 text-xs text-white/38">
                  No skills added yet
                </span>
              )}
            </div>
          </section>

          <section className="panel grid gap-4 p-5">
            <div>
              <h2 className="font-semibold text-white">Links</h2>
              <p className="mt-1 text-xs leading-5 text-white/42">These links help project owners quickly verify your work.</p>
            </div>
            <div className="grid gap-2">
              {linkItems.map(({ label, value, icon: Icon }) => (
                <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-2" key={label}>
                  <span className="inline-flex min-w-0 items-center gap-2 text-sm text-white/62">
                    <Icon size={15} className="shrink-0 text-cyan" />
                    <span>{label}</span>
                  </span>
                  <span className={`truncate text-xs ${value ? "text-mint" : "text-white/34"}`}>{value ? "Added" : "Not added"}</span>
                </div>
              ))}
            </div>
            <Field label="Portfolio URL">
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} />
                <input className="input pl-10" value={profile.portfolioUrl} onChange={(event) => updateField("portfolioUrl", event.target.value)} placeholder="https://your-site.com" />
              </div>
            </Field>
            <Field label="GitHub URL">
              <div className="relative">
                <Github className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} />
                <input className="input pl-10" value={profile.githubUrl} onChange={(event) => updateField("githubUrl", event.target.value)} placeholder="https://github.com/you" />
              </div>
            </Field>
            <Field label="LinkedIn URL">
              <div className="relative">
                <Linkedin className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} />
                <input className="input pl-10" value={profile.linkedinUrl} onChange={(event) => updateField("linkedinUrl", event.target.value)} placeholder="https://linkedin.com/in/you" />
              </div>
            </Field>
          </section>
        </aside>
      </form>
    </main>
  );
}
