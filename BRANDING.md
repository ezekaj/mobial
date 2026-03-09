# 🎨 MobiaL Branding Guide

## Logo Integration

The official MobiaL logo has been integrated throughout the entire platform.

### Logo Files
- **Main Logo:** `/public/logo.png` (1536x1024)
- **Legacy SVG:** `/public/logo.svg` (kept for backup)

### Logo Placement

The logo appears in the following locations:

1. **Header (All Pages)**
   - Location: Top-left corner
   - Size: h-10 w-auto (40px height, auto width)
   - Link: Links to homepage

2. **Mobile Navigation**
   - Location: Top of mobile menu
   - Size: h-10 w-auto
   - Visible when mobile menu opened

3. **Footer (All Pages)**
   - Location: Footer brand section
   - Size: h-10 w-auto
   - Above company description

4. **Homepage Hero**
   - Location: Right side of hero section
   - Size: Full width of container
   - Displayed as feature image

5. **Admin Panel**
   - Location: Sidebar top
   - Size: h-10 w-auto
   - Links to admin dashboard

6. **Affiliate Portal**
   - Location: Sidebar top
   - Size: h-10 w-auto
   - Links to affiliate dashboard

## Color Scheme

### Primary Colors (Based on Logo)
```css
--primary: oklch(0.65 0.18 160);     /* Emerald Green */
--primary-foreground: oklch(0.99 0 0); /* White */
```

### Secondary Colors
```css
--accent: oklch(0.75 0.15 65);       /* Amber/Orange */
--accent-foreground: oklch(0.20 0.02 65);
```

### Neutral Colors
```css
--background: oklch(0.99 0.002 140);  /* Off-white */
--foreground: oklch(0.15 0.02 140);   /* Dark gray */
--border: oklch(0.91 0.01 160);       /* Light border */
```

## Typography

### Font Family
- **Primary:** Geist Sans (modern, clean)
- **Monospace:** Geist Mono (code, technical)

### Font Sizes
- **Logo Text:** Not used (image logo)
- **Headings:** 2xl-6xl
- **Body:** sm-base
- **Small:** xs-sm

## Usage Guidelines

### Do's ✅
- Use the official logo PNG file
- Maintain clear space around logo
- Use on light backgrounds for best visibility
- Link logo to appropriate dashboard

### Don'ts ❌
- Don't stretch or distort logo
- Don't change logo colors
- Don't add effects (shadows, gradients)
- Don't use old "M" icon as primary logo

## Brand Voice

### Tone
- **Professional** - Trustworthy, reliable
- **Friendly** - Approachable, helpful
- **Global** - International, inclusive

### Messaging
- Focus on connectivity
- Emphasize simplicity
- Highlight affordability
- Trust and security

## Visual Elements

### Gradients
```css
gradient-primary: from-primary to-primary/70
gradient-accent: from-accent to-accent/70
```

### Animations
- Logo hover: scale(1.05)
- Logo tap: scale(0.95)
- Smooth transitions: 0.3s ease

### Icons
- Library: Lucide React
- Style: Outline, 1.5px stroke
- Size: Consistent 16-24px

## Responsive Behavior

### Desktop (≥1024px)
- Logo: 40px height
- Full navigation visible
- Logo in header and footer

### Tablet (768px - 1023px)
- Logo: 40px height
- Collapsible navigation
- Logo in header and footer

### Mobile (<768px)
- Logo: 40px height
- Hamburger menu
- Logo in header and mobile menu

## Accessibility

### Alt Text
```html
<img src="/logo.png" alt="MobiaL" />
```

### Contrast
- Logo on light background: WCAG AA compliant
- Minimum contrast ratio: 4.5:1

### Focus States
- Interactive elements: visible focus ring
- Keyboard navigation: full support

## File Locations

```
public/
├── logo.png          # Main logo (1536x1024)
├── logo.svg          # SVG backup
├── icons/            # App icons
└── manifest.json     # PWA manifest

src/
├── app/
│   ├── globals.css   # Color variables
│   └── layout.tsx    # Root layout
└── components/
    └── layout/
        ├── header.tsx
        ├── footer.tsx
        └── mobile-nav.tsx
```

## Brand Updates

### March 7, 2026
- ✅ Integrated official logo PNG
- ✅ Removed placeholder "M" icon
- ✅ Updated all navigation components
- ✅ Updated admin panel
- ✅ Updated affiliate portal
- ✅ Updated homepage hero

---

**Last Updated:** March 7, 2026
**Version:** 1.0
**Maintained By:** Design Team
