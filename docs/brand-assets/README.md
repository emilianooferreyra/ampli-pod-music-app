# Ampli Brand Assets

This folder contains all logo files and brand assets for Ampli.

## Files Included

### SVG Files (Vector - Use these when possible)

- **ampli-icon.svg** - Icon only (purple waveform)
- **ampli-icon-white.svg** - Icon only (white, for dark backgrounds)
- **ampli-logo.svg** - Full horizontal logo (icon + wordmark)
- **ampli-logo-white.svg** - Full logo in white (for dark backgrounds)
- **ampli-app-icon.svg** - App icon with gradient background (1024x1024)

### PNG Files (Raster - Generated from SVG)

To generate PNG files from SVG:

#### Option 1: Use the script (macOS/Linux)

```bash
# Install a converter first (choose one):
brew install librsvg        # Recommended
# OR
brew install imagemagick
# OR
brew install inkscape

# Then run the script:
./convert-to-png.sh
```

#### Option 2: Online Converters

Upload SVG files to:
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/
- https://convertio.co/svg-png/

**Recommended sizes:**
- Icon: 512x512, 256x256
- Full logo: 2048px wide
- App icon: 1024x1024 (iOS), 512x512 (Android)
- Favicons: 32x32, 16x16
- Apple touch icon: 180x180

#### Option 3: Use Figma/Sketch

1. Import SVG into Figma
2. Select the artboard
3. Export as PNG at desired size

## Usage Guidelines

### Which File to Use?

**For websites/web apps:**
- Use SVG files (they scale perfectly)
- Use `ampli-logo.svg` for light backgrounds
- Use `ampli-logo-white.svg` for dark backgrounds

**For app icons:**
- Use `ampli-app-icon.svg` or convert to PNG
- iOS: 1024x1024px PNG (no transparency in background)
- Android: 512x512px PNG (adaptive icon)

**For favicons:**
- Convert icon to 32x32 and 16x16 PNG
- Modern browsers also support SVG favicons

**For social media:**
- Convert to PNG at recommended sizes:
  - Twitter/X profile: 400x400
  - Instagram: 1080x1080
  - Facebook: 180x180
  - LinkedIn: 300x300

### Color Specifications

**Primary Purple:** `#7C3AED`
- RGB: 124, 58, 237
- HSL: 258°, 84%, 58%

**Gradient (App Icon):**
- Start: `#7C3AED` (purple)
- End: `#EC4899` (pink)
- Angle: 135°

**White:** `#FFFFFF`

**Dark Text:** `#0F172A`

## React Components

See the components folder for ready-to-use React components:

```typescript
import { AmpliIcon, AmpliLogo } from '@/components/brand/Logo'

// Use in your app:
<AmpliIcon size={32} />
<AmpliLogo variant="light" height={40} />
```

## Need Help?

Refer to the main branding guide: `/docs/branding-guide.md`

---

**Version:** 1.0
**Last Updated:** 2025-10-18
