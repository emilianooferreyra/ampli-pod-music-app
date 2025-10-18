#!/bin/bash

# Script to convert SVG logos to PNG
# Requires: librsvg (for rsvg-convert) or Inkscape or ImageMagick

echo "Converting Ampli SVG logos to PNG..."

# Check if rsvg-convert is available (recommended)
if command -v rsvg-convert &> /dev/null; then
    echo "Using rsvg-convert..."

    # Convert icon (512x512 for favicons)
    rsvg-convert -w 512 -h 512 ampli-icon.svg -o ampli-icon-512.png
    rsvg-convert -w 512 -h 512 ampli-icon-white.svg -o ampli-icon-white-512.png

    # Convert icon (256x256)
    rsvg-convert -w 256 -h 256 ampli-icon.svg -o ampli-icon-256.png
    rsvg-convert -w 256 -h 256 ampli-icon-white.svg -o ampli-icon-white-256.png

    # Convert full logo (2048px wide)
    rsvg-convert -w 2048 ampli-logo.svg -o ampli-logo-2048.png
    rsvg-convert -w 2048 ampli-logo-white.svg -o ampli-logo-white-2048.png

    # Convert app icon (1024x1024 for iOS)
    rsvg-convert -w 1024 -h 1024 ampli-app-icon.svg -o ampli-app-icon-1024.png

    # Favicon sizes
    rsvg-convert -w 32 -h 32 ampli-icon.svg -o favicon-32.png
    rsvg-convert -w 16 -h 16 ampli-icon.svg -o favicon-16.png
    rsvg-convert -w 180 -h 180 ampli-icon.svg -o apple-touch-icon-180.png

    echo "✓ Conversion complete using rsvg-convert!"

# Check if ImageMagick is available
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick..."

    # Convert icon (512x512)
    convert -background none -resize 512x512 ampli-icon.svg ampli-icon-512.png
    convert -background none -resize 512x512 ampli-icon-white.svg ampli-icon-white-512.png

    # Convert icon (256x256)
    convert -background none -resize 256x256 ampli-icon.svg ampli-icon-256.png
    convert -background none -resize 256x256 ampli-icon-white.svg ampli-icon-white-256.png

    # Convert full logo (2048px wide)
    convert -background none -resize 2048x ampli-logo.svg ampli-logo-2048.png
    convert -background none -resize 2048x ampli-logo-white.svg ampli-logo-white-2048.png

    # Convert app icon (1024x1024)
    convert -background none -resize 1024x1024 ampli-app-icon.svg ampli-app-icon-1024.png

    # Favicon sizes
    convert -background none -resize 32x32 ampli-icon.svg favicon-32.png
    convert -background none -resize 16x16 ampli-icon.svg favicon-16.png
    convert -background none -resize 180x180 ampli-icon.svg apple-touch-icon-180.png

    echo "✓ Conversion complete using ImageMagick!"

# Check if Inkscape is available
elif command -v inkscape &> /dev/null; then
    echo "Using Inkscape..."

    # Convert icon (512x512)
    inkscape ampli-icon.svg --export-filename=ampli-icon-512.png --export-width=512 --export-height=512
    inkscape ampli-icon-white.svg --export-filename=ampli-icon-white-512.png --export-width=512 --export-height=512

    # Convert icon (256x256)
    inkscape ampli-icon.svg --export-filename=ampli-icon-256.png --export-width=256 --export-height=256
    inkscape ampli-icon-white.svg --export-filename=ampli-icon-white-256.png --export-width=256 --export-height=256

    # Convert full logo (2048px wide)
    inkscape ampli-logo.svg --export-filename=ampli-logo-2048.png --export-width=2048
    inkscape ampli-logo-white.svg --export-filename=ampli-logo-white-2048.png --export-width=2048

    # Convert app icon (1024x1024)
    inkscape ampli-app-icon.svg --export-filename=ampli-app-icon-1024.png --export-width=1024 --export-height=1024

    # Favicon sizes
    inkscape ampli-icon.svg --export-filename=favicon-32.png --export-width=32 --export-height=32
    inkscape ampli-icon.svg --export-filename=favicon-16.png --export-width=16 --export-height=16
    inkscape ampli-icon.svg --export-filename=apple-touch-icon-180.png --export-width=180 --export-height=180

    echo "✓ Conversion complete using Inkscape!"

else
    echo "❌ Error: No SVG to PNG converter found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - librsvg:     brew install librsvg     (macOS)"
    echo "  - ImageMagick: brew install imagemagick (macOS)"
    echo "  - Inkscape:    brew install inkscape    (macOS)"
    echo ""
    echo "Or use an online converter:"
    echo "  - https://cloudconvert.com/svg-to-png"
    echo "  - https://svgtopng.com/"
    exit 1
fi

echo ""
echo "Generated files:"
echo "  - ampli-icon-512.png"
echo "  - ampli-icon-256.png"
echo "  - ampli-logo-2048.png"
echo "  - ampli-app-icon-1024.png"
echo "  - favicon-32.png, favicon-16.png"
echo "  - apple-touch-icon-180.png"
echo ""
echo "✓ All done!"
