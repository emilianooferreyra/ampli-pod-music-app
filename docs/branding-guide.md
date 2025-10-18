# Ampli - Branding Guide

## Brand Identity

**Name:** Ampli
**Tagline:** Amplify Your Voice
**Domain:** ampli.app
**Positioning:** Free audio platform for creators to share podcasts, music, and audio content with the world

---

## Brand Essence

### What Ampli Represents

- **Amplification** - Giving voice to creators
- **Freedom** - Open platform, no barriers
- **Community** - Connecting creators with their audience
- **Simplicity** - Clean, easy to use
- **Modern** - Fresh take on audio sharing

### Brand Personality

- Approachable yet professional
- Creative but not chaotic
- Empowering, not intimidating
- Minimal, not bare
- Bold, not loud

---

## Logo Concepts

### Concept 1: Waveform Symbol (Recommended)

```
   ╱╲
  ╱  ╲╱╲
 ╱      ╲  ampli
╱        ╲
```

**Design Elements:**

- Stylized audio waveform forming an "A"
- Can also represent a mountain/peak (reaching new heights)
- Or an amplifier dial turned up
- Clean, geometric lines
- Works in monochrome or color

**Variations:**

- Icon only (for app icon, favicon)
- Icon + wordmark (for website header)
- Wordmark only (for text-only contexts)

**Icon Characteristics:**

- Simple 3-4 wave peaks forming triangular "A" shape
- Can be contained in a circle for app icon
- Scalable from 16px to billboard size
- Recognizable even at small sizes

### Concept 2: Amplifier Knob

```
    ___
   /   \
  | ⚊⚊⚊ |  ampli
   \___/
```

**Design Elements:**

- Circular amplifier dial/knob
- Volume indicator marks around it
- Turned up to maximum (amplified!)
- Minimalist, single-line design

### Concept 3: Sound Burst

```
   )))
  ))) ●  ampli
   )))
```

**Design Elements:**

- Concentric circles emanating from center
- Represents sound waves spreading out
- Dynamic, energy radiating outward
- Can be animated in app

---

## Color Palette

### Primary Colors

**Option A: Bold & Energetic (Recommended)**

**Primary:**

- **Ampli Purple**: `#7C3AED` (Vibrant purple - premium, creative)
  - RGB: 124, 58, 237
  - HSL: 258°, 84%, 58%

**Secondary:**

- **Electric Blue**: `#3B82F6` (Trust, technology)
  - RGB: 59, 130, 246
  - HSL: 217°, 91%, 60%

**Accent:**

- **Neon Pink**: `#EC4899` (Energy, attention)
  - RGB: 236, 72, 153
  - HSL: 330°, 81%, 60%

**Neutrals:**

- **Dark**: `#0F172A` (Text, backgrounds)
- **Gray**: `#64748B` (Secondary text)
- **Light**: `#F8FAFC` (Backgrounds)
- **White**: `#FFFFFF`

**Gradient:**

```css
background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
```

---

**Option B: Minimal & Professional**

**Primary:**

- **Deep Navy**: `#1E293B`
- **Slate**: `#475569`

**Accent:**

- **Coral**: `#F97316` (Warm, inviting)

**Neutrals:**

- Similar to Option A

---

### Color Usage Guidelines

**Primary Purple (#7C3AED):**

- Main CTAs (Play, Upload, Follow buttons)
- Logo icon
- Links and interactive elements
- Progress bars, sliders
- Active states

**Electric Blue (#3B82F6):**

- Secondary buttons
- Informational elements
- Tags, badges
- Hover states

**Neon Pink (#EC4899):**

- Like/heart icons
- Notifications
- Highlights
- Special features

**Dark (#0F172A):**

- Primary text
- Dark mode background
- Headers

**Light (#F8FAFC):**

- Light mode background
- Cards, panels
- Subtle borders

---

## Typography

### Primary Typeface: **Inter** (Recommended)

```
Ampli - Inter Bold
The quick brown fox jumps - Inter Regular
Small details and captions - Inter Medium
```

**Why Inter:**

- Modern, clean, highly readable
- Excellent at all sizes
- Free and open source
- Variable font (flexible weights)
- Optimized for screens
- Used by: GitHub, Mozilla, Linear

**Weights to use:**

- **Bold (700)**: Headlines, logo wordmark
- **Semibold (600)**: Subheadings, buttons
- **Medium (500)**: Body text emphasis
- **Regular (400)**: Body text
- **Light (300)**: Captions (sparingly)

### Alternative: **Poppins**

More playful, rounded. Good if you want friendlier vibe.

### Font Pairing (if needed)

**Headlines:** Inter Bold
**Body:** Inter Regular
**Mono (for code/technical):** JetBrains Mono

---

## Logo Lockups

### Primary Logo (Horizontal)

```
[ICON] ampli
```

- Use on light backgrounds
- Minimum size: 120px wide
- Clear space: 1x icon height around logo

### Stacked Logo (Vertical)

```
[ICON]
ampli
```

- Use when horizontal space limited
- Social media profiles
- App icon with text

### Icon Only

```
[ICON]
```

- App icon
- Favicon
- Social media avatar
- Very small contexts

### Wordmark Only

```
ampli
```

- Text-only contexts
- Footer
- Emails
- When icon would be too small

---

## App Icon Design

### iOS/Android App Icon

**Recommended Design:**

```
┌─────────────────┐
│                 │
│    ╱╲           │
│   ╱  ╲╱╲        │  Purple gradient background
│  ╱      ╲       │  White waveform "A"
│ ╱        ╲      │  Rounded corners (iOS: 20%, Android: rounded)
│                 │
└─────────────────┘
```

**Specs:**

- **iOS**: 1024x1024px (no alpha channel)
- **Android**: 512x512px (adaptive icon)
- **Background**: Purple to pink gradient
- **Foreground**: White waveform symbol
- **Safe area**: Keep icon within center 80%
- **No text** on icon (text gets cut off at small sizes)

**Adaptive Icon (Android):**

- Background layer: Gradient
- Foreground layer: White symbol
- This allows for different shaped masks (circle, squircle, rounded square)

---

## Logo Construction Grid

### Geometric Proportions

```
┌───┬───┬───┬───┬───┬───┐
│   │   │ ╱ │   │   │   │  Peak 1: Highest
├───┼───┼╱──┼───┼───┼───┤
│   │  ╱│╲  │╱╲ │   │   │  Peak 2 & 3: Medium
├───┼─╱─┼─╲─┼╱──╲───┼───┤
│  ╱│   │  ╲│    ╲  │   │  Peak 4: Low
├─╱─┼───┼───┼────╲──┼───┤
│╱  │   │   │     ╲ │   │  Baseline
└───┴───┴───┴────┴─╲┴───┘
```

**Proportions:**

- Width to height ratio: 1:1 for icon
- Line weight: Consistent 8-10% of total height
- Spacing: Equal negative space between peaks
- Angles: 45° and 30° for dynamic feel

---

## Visual Style Guide

### Design Principles

**1. Minimal but not empty**

- Clean interfaces with breathing room
- Purposeful use of white space
- Not cluttered, but not sterile

**2. Bold when it matters**

- Strong CTAs that stand out
- Vibrant colors for key actions
- Confident typography

**3. Audio-first design**

- Waveforms as visual elements
- Progress bars that look like audio tracks
- Visual feedback for audio actions

**4. Smooth animations**

- Subtle transitions (200-300ms)
- Ease-out for natural feel
- Audio-reactive animations where appropriate

### UI Components Style

**Buttons:**

```
Primary: Purple background, white text, rounded (8px)
Secondary: Transparent with purple border
Text: Purple text, no background
```

**Cards:**

```
Light mode: White with subtle shadow
Dark mode: Dark gray (#1E293B) with border
Border radius: 12px
Padding: 16-24px
```

**Audio Player:**

```
Waveform visualization (optional)
Purple progress bar
Clean controls with icons
Time stamps in gray
```

**Profile Pictures:**

```
Circular
Border: 2px white (on colored backgrounds)
Placeholder: Gradient background with initials
```

---

## Imagery Style

### Photography

**Do:**

- Authentic, real creators
- Natural lighting
- Diverse representation
- Behind-the-scenes vibe
- Studio/recording environments
- Headphones, mics, authentic gear

**Don't:**

- Stock photo feel
- Overly posed
- Too polished/perfect
- Generic "podcast" imagery

### Illustrations

**Style:**

- Minimal, geometric
- Use brand colors
- Abstract audio/sound concepts
- Line art or flat design
- Avoid overly detailed illustrations

**Examples:**

- Sound waves as design elements
- Geometric patterns suggesting audio
- Abstract shapes in brand colors
- Duotone images (purple/pink)

---

## Iconography

### Icon Style

**Characteristics:**

- 2px stroke weight
- Rounded corners (2px radius)
- 24x24px grid
- Outlined style (not filled)
- Consistent with Heroicons or Lucide

**Common Icons Needed:**

- Play/Pause
- Upload
- Heart/Like
- Share
- Profile
- Search
- Playlist
- History
- Settings
- Notification bell
- Comments
- Follow/Following
- More (three dots)

**Icon Color:**

- Default: Gray (#64748B)
- Active: Purple (#7C3AED)
- Destructive: Red (#EF4444)

---

## Motion & Animation

### Animation Principles

**Timing:**

- Quick interactions: 150-200ms
- Medium transitions: 250-350ms
- Long animations: 400-600ms
- Never exceed 800ms

**Easing:**

- Ease-out for entering elements
- Ease-in for exiting elements
- Ease-in-out for transitions
- Spring animations for playful interactions

**Common Animations:**

**Audio playback:**

```
Waveform pulsing
Progress bar filling
Play button morph to pause
Volume slider feedback
```

**Interactions:**

```
Button hover: Scale 1.02, brighten
Card hover: Lift with shadow
Like: Heart bounce + color change
Follow: Button text fade + color transition
```

**Page transitions:**

```
Fade + slide (subtle, 20-30px)
Fast and smooth
Respect reduced motion preferences
```

---

## Voice & Tone

### Brand Voice

**Characteristics:**

- Encouraging, not pushy
- Clear, not technical
- Friendly, not casual
- Confident, not arrogant
- Inclusive, not exclusive

### Writing Style

**Do:**

- Use active voice
- Keep it concise
- Speak directly to users ("You", "Your")
- Be encouraging about creation
- Use contractions (we're, you'll)

**Don't:**

- Use jargon unnecessarily
- Be overly corporate
- Use internet speak excessively
- Patronize users
- Overuse exclamation marks

### Example Copy

**Good:**

- "Upload your first track"
- "Share your voice with the world"
- "Build your audience"
- "Start creating today"

**Avoid:**

- "Leverage our platform to maximize engagement!"
- "Disrupt the audio space"
- "Synergize with listeners"

---

## Applications

### Website Header

```
┌────────────────────────────────────────────────┐
│  [Logo] ampli    Discover  Upload   Profile    │
└────────────────────────────────────────────────┘
```

### Social Media

**Twitter/X Banner:**

- Gradient background
- Logo + "Amplify Your Voice"
- 1500x500px

**Instagram:**

- Square posts with brand colors
- Waveform patterns as backgrounds
- Consistent filters/look

### Email Templates

**Header:**

- Logo centered or left-aligned
- Purple accent line below header
- Clear hierarchy

**Footer:**

- Social icons in brand colors
- Copyright in gray
- Minimal design

---

## Dark Mode

### Color Adjustments

**Backgrounds:**

- Pure black too harsh - use `#0F172A`
- Cards: `#1E293B`
- Borders: `#334155` (subtle)

**Text:**

- Primary: `#F8FAFC` (off-white)
- Secondary: `#94A3B8` (gray)

**Colors:**

- Slightly desaturated versions
- Purple: `#8B5CF6` (lighter)
- Pink: `#F472B6` (lighter)
- Blue: `#60A5FA` (lighter)

**Logo:**

- White icon + white text on dark
- Glowing effect optional (subtle)

---

## Accessibility

### Color Contrast

**Minimum ratios (WCAG AA):**

- Normal text: 4.5:1
- Large text (18px+): 3:1
- UI components: 3:1

**Our palette:**

- Purple `#7C3AED` on white: ✅ 4.8:1
- White on purple: ✅ 4.8:1
- Pink on white: ⚠️ Use for non-text elements
- Blue on white: ✅ 4.6:1

### Best Practices

- Never rely on color alone
- Add icons to buttons
- Provide text alternatives
- Support keyboard navigation
- Respect reduced motion
- Ensure focus indicators visible

---

## Logo Usage

### Do's ✅

- Use approved logo files
- Maintain aspect ratio
- Provide clear space
- Use on approved backgrounds
- Scale proportionally

### Don'ts ❌

- Don't stretch or distort
- Don't rotate at odd angles
- Don't add effects (drop shadows, glows)
- Don't change colors (use approved versions)
- Don't place on busy backgrounds
- Don't recreate or modify

### Minimum Sizes

- **Digital:** 32px height (icon), 100px width (full logo)
- **Print:** 0.5 inches height
- **Favicon:** 32x32px minimum

---

## File Formats

### Logo Files Needed

**Vector:**

- `ampli-logo.svg` - Full horizontal logo
- `ampli-icon.svg` - Icon only
- `ampli-wordmark.svg` - Text only
- All in primary purple and white versions

**Raster:**

- `ampli-logo.png` - 2048px wide (transparent)
- `ampli-logo-white.png` - For dark backgrounds
- `ampli-icon.png` - 1024x1024px (transparent)
- App icons in various sizes (iOS/Android standards)

**Favicon:**

- `favicon.ico` - 32x32px, 16x16px
- `favicon.svg` - Vector version
- `apple-touch-icon.png` - 180x180px

---

## Brand Assets Checklist

### Essential Files

- [ ] Logo (SVG, PNG in multiple sizes)
- [ ] App icon (iOS 1024x1024, Android adaptive)
- [ ] Favicon (ICO, SVG, PNG)
- [ ] Brand colors (CSS variables, Tailwind config)
- [ ] Typography (fonts loaded, weights defined)
- [ ] Icon set (consistent style)
- [ ] Social media templates
- [ ] Email templates
- [ ] Presentation template

### Design System

- [ ] Figma/Sketch file with components
- [ ] Component library (buttons, cards, etc.)
- [ ] Color palette swatches
- [ ] Typography scale
- [ ] Spacing system
- [ ] Grid system
- [ ] Responsive breakpoints

---

## Implementation

### CSS Variables (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ampli: {
          purple: "#7C3AED",
          blue: "#3B82F6",
          pink: "#EC4899",
          dark: "#0F172A",
          gray: "#64748B",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        ampli: "12px",
      },
      boxShadow: {
        ampli: "0 4px 20px rgba(124, 58, 237, 0.15)",
      },
    },
  },
};
```

### React Components

```typescript
// Button.tsx
<button className="bg-ampli-purple text-white rounded-ampli px-6 py-3
                   font-semibold hover:scale-102 transition-transform">
  Upload Track
</button>

// Logo.tsx
<svg viewBox="0 0 100 100" className="text-ampli-purple">
  {/* Waveform A shape */}
</svg>
```

---

## Design Tools

### Recommended Software

**Logo Creation:**

- Figma (recommended - free, web-based)
- Adobe Illustrator (professional)
- Inkscape (free alternative)

**Icon Design:**

- Heroicons (https://heroicons.com)
- Lucide (https://lucide.dev)
- Custom in Figma

**Color Management:**

- Coolors.co (palettes)
- Color.review (contrast checking)
- Realtime Colors (preview in context)

**Mockups:**

- Figma
- Sketch
- Adobe XD

---

## Quick Start Guide

### For Designers

1. Download brand assets from `/docs/brand-assets/`
2. Use color palette in designs
3. Apply Inter font family
4. Follow spacing guidelines (8px grid)
5. Use rounded corners (8-12px)
6. Ensure minimum contrast ratios

### For Developers

1. Import Tailwind config with Ampli colors
2. Load Inter font from Google Fonts
3. Use CSS variables for consistency
4. Implement dark mode support
5. Add logo SVG components
6. Follow accessibility guidelines

### For Content Creators

1. Use brand voice guidelines
2. Apply visual style to graphics
3. Maintain consistent tone
4. Use approved logo files
5. Follow color palette
6. Keep messaging clear and encouraging

---

## Examples & Inspiration

### Similar Brands (Reference)

**Color/Vibe:**

- Spotify (bold, confident)
- Discord (playful purple)
- Twitch (electric purple)

**UI/UX:**

- SoundCloud (audio-first)
- Bandcamp (creator-focused)
- Linear (minimal, clean)

**Community:**

- Patreon (creator empowerment)
- Ko-fi (supportive, friendly)

---

## Next Steps

### Phase 1: Create Logo

- [ ] Sketch waveform "A" concepts
- [ ] Refine in vector software
- [ ] Create variations (icon, wordmark, full)
- [ ] Export in all needed formats

### Phase 2: Build Design System

- [ ] Set up Figma with components
- [ ] Create button styles
- [ ] Design audio player
- [ ] Design cards and layouts
- [ ] Create icon set

### Phase 3: Apply to Product

- [ ] Update app with new branding
- [ ] Implement logo component
- [ ] Apply color palette
- [ ] Update typography
- [ ] Test dark mode

### Phase 4: Marketing Materials

- [ ] Social media templates
- [ ] Website design
- [ ] Email templates
- [ ] Presentation deck

---

## Resources

### Fonts

- Inter: https://rsms.me/inter/
- Google Fonts: https://fonts.google.com/specimen/Inter

### Colors

- Color Contrast Checker: https://webaim.org/resources/contrastchecker/
- Coolors: https://coolors.co/

### Icons

- Heroicons: https://heroicons.com
- Lucide: https://lucide.dev

### Design Inspiration

- Dribbble (search: audio app, music player)
- Behance (search: logo design, audio branding)
- Mobbin (search: music, audio apps)

---

**Version:** 1.0
**Last Updated:** 2025-10-18
**Author:** Claude Code Assistant

---

## Notes

This is a living document. Update as the brand evolves. Keep all team members aligned on brand guidelines. Consistency is key to building brand recognition.
