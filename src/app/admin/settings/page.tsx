'use client';

import { useState } from 'react';
import { Save, Upload } from 'lucide-react';

export default function AdminSettings() {
  const [profile, setProfile] = useState({
    headline: 'Multi-Disciplinary Professional',
    bio: "I'm an Information Systems student with a strong interest in technology and data.",
    cvLink: '',
    linkedin: 'https://www.linkedin.com/in/andhika-karunia-545166292',
    github: 'https://github.com/Tryton47',
    instagram: 'https://www.instagram.com/andhka_rzq',
    youtube: '',
    email: 'andhikakarunia79@gmail.com',
    phone: '0821-4163-5002',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production, this would POST to an API endpoint
    // For now, save to localStorage as a config store
    localStorage.setItem('profile_config', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-text-primary text-lg font-bold mb-1">Profile Settings</h2>
        <p className="text-text-dim text-xs">Configure your public-facing profile information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Main Profile */}
        <div className="glass-panel border border-border rounded-xl p-6 flex flex-col gap-5">
          <h3 className="text-text-primary text-sm font-bold border-b border-border pb-3">
            Personal Information
          </h3>

          {/* Photo Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-system text-text-dim">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-charcoal border border-border flex items-center justify-center overflow-hidden">
                <img src="/foto-pribadi.png" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <label className="px-4 py-2 border border-border rounded-lg text-system text-text-muted hover:border-neon-red/30 hover:text-neon-red transition-colors cursor-pointer flex items-center gap-2">
                <Upload size={14} /> Choose File
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-system text-text-dim">Headline / Title</label>
            <input
              type="text"
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-system text-text-dim">Bio / About Text</label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-system text-text-dim">CV Download Link</label>
            <input
              type="url"
              value={profile.cvLink}
              onChange={(e) => setProfile({ ...profile, cvLink: e.target.value })}
              className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
              placeholder="https://drive.google.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-system text-text-dim">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-system text-text-dim">Phone / WA</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
              />
            </div>
          </div>
        </div>

        {/* Right: Social Links */}
        <div className="glass-panel border border-border rounded-xl p-6 flex flex-col gap-5">
          <h3 className="text-text-primary text-sm font-bold border-b border-border pb-3">
            Social Media Links
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-system text-text-dim">LinkedIn</label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
              className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-system text-text-dim">GitHub</label>
            <input
              type="url"
              value={profile.github}
              onChange={(e) => setProfile({ ...profile, github: e.target.value })}
              className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-system text-text-dim">Instagram</label>
            <input
              type="url"
              value={profile.instagram}
              onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
              className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-system text-text-dim">YouTube</label>
            <input
              type="url"
              value={profile.youtube}
              onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
              className="w-full bg-obsidian border border-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-neon-red/50"
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-neon-red text-white text-system rounded-lg hover:bg-[#e0243b] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,42,67,0.3)]"
        >
          <Save size={14} /> Simpan Profil
        </button>
        {saved && (
          <span className="text-neon-cyan text-xs font-mono animate-pulse">
            ✓ Profile saved successfully!
          </span>
        )}
      </div>
    </div>
  );
}
