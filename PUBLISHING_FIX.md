# Publishing Fix Documentation

## Problem
The project was failing to publish through Figma Make due to configuration issues.

## Root Causes Identified and Fixed

### 1. Missing Entry Point Files
**Issue**: The project was missing essential entry point files that Vite and Figma Make require.

**Fixed by creating**:
- `/index.html` - HTML entry point with proper references
- `/src/main.tsx` - React application bootstrap file

### 2. Incorrect Dependency Configuration
**Issue**: `react` and `react-dom` were configured as optional peer dependencies instead of regular dependencies.

**Fixed in**: `/package.json`
- Moved `react` and `react-dom` to the `dependencies` section
- Removed `peerDependencies` and `peerDependenciesMeta` sections

### 3. Complex Build Configuration
**Issue**: The `vite.config.ts` had a dual-entry build configuration with multiple entry points and manual chunk splitting, which conflicts with Figma Make's publishing system.

**Fixed by**:
- Simplified `/vite.config.ts` to standard Figma Make format (single entry point)
- Created `/vite.config.embed.ts` for WordPress embeddable widget builds
- Added separate build scripts in `package.json`

### 4. Missing TypeScript Configuration
**Issue**: No TypeScript configuration files existed, which could cause type-checking and build issues.

**Fixed by creating**:
- `/tsconfig.json` - Main TypeScript configuration with path aliases
- `/tsconfig.node.json` - TypeScript configuration for build tools

## File Structure

```
/
├── index.html                    # HTML entry point
├── package.json                  # Updated with correct dependencies
├── vite.config.ts               # Simplified config for Figma Make publishing
├── vite.config.embed.ts         # Advanced config for WordPress embeddable builds
├── tsconfig.json                # Main TypeScript configuration
├── tsconfig.node.json           # TypeScript config for build tools
└── src/
    ├── main.tsx                 # React bootstrap (renders App)
    ├── widget-embed.tsx         # WordPress embeddable widget entry
    └── app/
        └── App.tsx              # Main application component
```

## Build Commands

### For Figma Make Publishing (Simplified Build)
```bash
npm run build
# or
vite build
```
This uses the simplified `vite.config.ts` and is compatible with Figma Make's publishing system.

### For WordPress Embeddable Widget (Advanced Build)
```bash
npm run build:embed
# or
vite build --config vite.config.embed.ts
```
This uses the advanced configuration with:
- Dual entry points (main app + embeddable widget)
- Manual chunk splitting for optimal caching
- Separate vendor bundles

### Development Mode
```bash
npm run dev
# or
vite
```

### Preview Built Application
```bash
npm run preview
# or
vite preview
```

## Publishing Workflow

### Option 1: Publish via Figma Make (Recommended for Testing)
1. Use the standard "Publish" feature in Figma Make
2. The simplified `vite.config.ts` will be used automatically
3. This creates a standalone web application

### Option 2: Build for WordPress Integration
1. Run `npm run build:embed` locally
2. Export the built files from the `dist` folder
3. Deploy to your WordPress site
4. The embeddable widget will be available alongside the main app

### Option 3: Manual Git/GitLab Publishing
Since Figma Make doesn't support GitLab integration:
1. Export your project files from Figma Make
2. Initialize a git repository locally
3. Add your GitLab remote: `git remote add origin https://gitlab.integ.ro/your-repo.git`
4. Commit and push your changes

## What Changed

### `/vite.config.ts` (Simplified)
- Removed custom `rollupOptions`
- Removed multiple entry points
- Removed manual chunk configuration
- Now uses standard Vite defaults compatible with Figma Make

### `/vite.config.embed.ts` (New)
- Contains the original advanced build configuration
- Supports dual entry points (main + widget)
- Includes manual chunk splitting
- Use this for production WordPress builds

### `/package.json`
- Added `react` and `react-dom` to dependencies
- Added `build:embed` script
- Added `dev` and `preview` scripts

## Testing

After these fixes, you should be able to:
1. ✅ Publish successfully through Figma Make
2. ✅ Build the embeddable WordPress widget using `npm run build:embed`
3. ✅ Run the development server with `npm run dev`
4. ✅ Preview production builds with `npm run preview`

## Next Steps

1. **Try publishing again** through Figma Make - it should now work
2. **For WordPress deployment**: Use `npm run build:embed` to create the embeddable version
3. **For GitLab**: Export and manually push to your GitLab instance at gitlab.integ.ro

## Notes

- The simplified config is optimized for Figma Make's publishing system
- The embeddable config maintains all your custom optimization features
- Both configurations share the same codebase - just different build outputs
- All your widgets, theming system, and functionality remain unchanged
