# PostQuee Branding Guide

This document outlines all PostQuee branding customizations made to the Postiz codebase and provides guidance for maintaining branding during upstream updates.

## Overview

PostQuee is a branded fork of Postiz (https://github.com/gitroomhq/postiz-app). This guide helps maintain PostQuee branding when syncing with upstream Postiz updates.

## Branding Locations

### 1. Frontend Visual Branding

#### Logo and Icon Files (apps/frontend/public/)

**PostQuee branded files:**
- `postquee.png` - Main PNG logo
- `postquee.ico` - Browser favicon (ICO format)
- `postquee.svg` - SVG logo
- `postquee-icon.svg` - Icon variant
- `pq.png` - Compact logo
- `favicon.ico` - Active favicon (PostQuee branded)
- `favicon.png` - Active favicon (PostQuee branded)
- `logo.svg` - Active logo (PostQuee branded)
- `logo-text.svg` - Active logo with text (PostQuee branded)
- `postiz.svg` - Active Postiz logo (PostQuee branded)
- `postiz-text.svg` - Active Postiz text logo (PostQuee branded)
- `postiz-fav.png` - Active favicon PNG (PostQuee branded)
- `Postquee/` - Directory with additional PostQuee assets

**Original Postiz backups (.bak files):**
- `favicon.ico.bak` - Original Postiz favicon
- `logo.svg.bak` - Original Postiz logo
- `logo-text.svg.bak` - Original Postiz logo with text
- `postiz.svg.bak` - Original Postiz SVG
- `postiz-text.svg.bak` - Original Postiz text SVG

#### Color Theme

**Primary color:** `#FF8C00` (Orange)  
**Secondary AI color:** `#FF4500` (Red-Orange)

**Files:**
- `apps/frontend/tailwind.config.js` (line 14)
  ```javascript
  500: '#FF8C00', // Postquee Orange
  ```

- `apps/frontend/src/app/colors.scss` (lines 17, 18, 61, 62, 105, 108, 175, 178)
  ```scss
  --new-btn-primary: #FF8C00;
  --new-ai-btn: #FF4500;
  --color-forth: #FF8C00;
  --color-seventh: #FF8C00;
  ```

- `apps/frontend/src/components/new-layout/logo.tsx` (line 30)
  ```tsx
  fill="#FF8C00"
  ```

#### Dynamic Branding System

**File:** `apps/frontend/src/utils/brand-config.ts` (PostQuee-specific, not in upstream)

Provides `getBrandConfig()` function that returns:
- `appName`: "Postquee" (default)
- `appLogo`: "/postquee.png" (default)
- `appFavicon`: "/favicon.ico" (default)
- `supportEmail`: "benami.omri2@gmail.com"

Environment variables (optional):
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_LOGO`
- `NEXT_PUBLIC_APP_FAVICON`

**Components using dynamic branding:**
- `apps/frontend/src/components/ui/logo-text.component.tsx`
- `apps/frontend/src/components/new-layout/logo.tsx`
- `apps/frontend/src/app/(app)/layout.tsx`
- `apps/frontend/src/app/(app)/auth/login/page.tsx`

#### Analytics Domain

**File:** `apps/frontend/src/app/(app)/layout.tsx` (line 88)
```tsx
domain={!!process.env.IS_GENERAL ? 'postquee.com' : 'gitroom.com'}
```

**File:** `apps/frontend/src/components/layout/dubAnalytics.tsx` (line 10)
```tsx
return null; // Dub Analytics disabled for white-label
```

### 2. Extension Branding

**File:** `apps/extension/manifest.json` (line 3)
```json
"name": "PostQuee"
```

### 3. Backend Service Naming

#### Sentry Integration

**Backend naming:**  
**File:** `libraries/nestjs-libraries/src/sentry/initialize.sentry.ts` (line 19)
```typescript
name: `PostQuee ${capitalize(appName)}`,
```

**Frontend naming:**  
**File:** `libraries/react-shared-libraries/src/sentry/initialize.sentry.next.basic.ts` (line 27)
```typescript
name: 'PostQuee Frontend',
```

#### MCP Server

**File:** `libraries/nestjs-libraries/src/chat/start.mcp.ts` (line 17)
```typescript
name: 'PostQuee MCP',
```

### 4. Translation Files

**File:** `libraries/react-shared-libraries/src/translation/locales/en/translation.json`

Multiple references to "PostQuee" instead of "Postiz" including:
- Webhook descriptions
- N8N integration references
- API usage text
- MCP server descriptions
- FAQ entries
- Marketing copy

**Additional translations:**
- `libraries/react-shared-libraries/src/translation/locales/es/translation.json`
- `libraries/react-shared-libraries/src/translation/locales/fr/translation.json`

## Maintaining Branding During Upstream Updates

### Files That Are Always Safe (Outside Reset Scope)

These files are in the frontend/extension and won't be affected by backend resets:
- `apps/frontend/*` (all files)
- `apps/extension/*` (all files)
- `libraries/react-shared-libraries/*` (all files)

### Files That Require Reapplication (Inside Backend/Library Reset Scope)

When resetting `apps/backend/` or `libraries/nestjs-libraries/` to upstream, these files need PostQuee branding restored:

1. **libraries/nestjs-libraries/src/sentry/initialize.sentry.ts**
   - Line 19: Change `Postiz ${capitalize(appName)}` to `PostQuee ${capitalize(appName)}`

2. **libraries/nestjs-libraries/src/chat/start.mcp.ts**
   - Line 17: Change `'Postiz MCP'` to `'PostQuee MCP'`

### Upstream Reset Procedure

When pulling updates from Postiz upstream:

```bash
# 1. Create backup
git checkout -b postquee-backup-$(date +%Y%m%d-%H%M%S)
git checkout main

# 2. Extract branding patches
mkdir -p /tmp/postquee-patches
git diff HEAD -- libraries/nestjs-libraries/src/sentry/initialize.sentry.ts > /tmp/postquee-patches/sentry-branding.patch
git diff HEAD -- libraries/nestjs-libraries/src/chat/start.mcp.ts > /tmp/postquee-patches/mcp-branding.patch

# 3. Stash frontend branding
git add apps/frontend/ apps/extension/ libraries/react-shared-libraries/
git stash push -m "PostQuee branding - frontend"

# 4. Reset to upstream
git fetch origin main
git checkout origin/main -- apps/backend/ libraries/nestjs-libraries/

# 5. Restore PostQuee branding
git apply /tmp/postquee-patches/sentry-branding.patch
git apply /tmp/postquee-patches/mcp-branding.patch

# 6. Restore frontend
git stash pop

# 7. Rebuild
rm -rf node_modules apps/*/node_modules libraries/*/node_modules dist apps/*/dist .next
pnpm install
pnpm run build
```

### Verification Checklist

After upstream update, verify:

```bash
# Backend Sentry branding
grep "PostQuee" libraries/nestjs-libraries/src/sentry/initialize.sentry.ts

# MCP branding
grep "PostQuee" libraries/nestjs-libraries/src/chat/start.mcp.ts

# Frontend Sentry branding
grep "PostQuee" libraries/react-shared-libraries/src/sentry/initialize.sentry.next.basic.ts

# Orange color theme
grep "#FF8C00" apps/frontend/tailwind.config.js

# Logo files present
ls apps/frontend/public/postquee*

# Dynamic branding system
ls apps/frontend/src/utils/brand-config.ts
```

## Environment Variables

### PostQuee-Specific Variables

Add to your `.env` file (optional, defaults shown):

```bash
# PostQuee Branding (optional overrides)
NEXT_PUBLIC_APP_NAME=Postquee
NEXT_PUBLIC_APP_LOGO=/postquee.png
NEXT_PUBLIC_APP_FAVICON=/favicon.ico

# Analytics (optional)
IS_GENERAL=true  # Use postquee.com for analytics
```

### Standard Postiz Variables

All standard Postiz environment variables remain the same. See `.env.example` for full list.

## Testing Branding

### Visual Checks

1. **Frontend branding** (http://localhost:4200):
   - Logo should be PostQuee orange
   - Primary buttons should be orange (#FF8C00)
   - Favicon should show PostQuee icon
   - Page title should show "Postquee" (or custom APP_NAME)

### Service Checks

2. **Sentry logs:**
   - Backend logs should show "PostQuee Backend"
   - Frontend logs should show "PostQuee Frontend"

3. **MCP server:**
   - MCP client should see "PostQuee MCP" server name

### Build Checks

4. **Successful build:**
   ```bash
   pnpm run build
   # All builds should pass: frontend, backend, workers, cron
   ```

## Rollback

If upstream sync causes issues, restore from backup:

```bash
git reset --hard postquee-backup-<timestamp>
```

Or restore from stash:

```bash
git stash list
git stash apply stash@{N}
```

## Support

For questions about PostQuee branding:
- Email: benami.omri2@gmail.com
- Backup branch: Always created during upstream syncs as `postquee-backup-YYYYMMDD-HHMMSS`

## Related Documentation

- `CLAUDE.md` - Project instructions for Claude Code
- `Manual_Assets.md` - Manual asset management instructions
- `build.sh` - Container build script
- `.env.example` - Environment variable reference

---

**Last Updated:** $(date +%Y-%m-%d)  
**Upstream Commit:** 9e0eff7e (feat: payload wizard)  
**PostQuee Reset:** 2026-01-05
