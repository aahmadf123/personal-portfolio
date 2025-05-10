# Dependency Update Guide

This document outlines the major dependency updates and potential breaking changes.

## Major Updates

### React Markdown (v8 → v9)

**Breaking Changes:**
- The `children` prop is no longer supported. Use the `content` prop instead.
- Some plugins may need to be updated for compatibility.
- The internal structure has changed significantly.

**Migration:**
\`\`\`jsx
// Before
<ReactMarkdown>{markdownContent}</ReactMarkdown>

// After
<ReactMarkdown content={markdownContent} />
\`\`\`

### Framer Motion (v10 → v11)

**Breaking Changes:**
- Some animation defaults have changed
- Layout animations behavior has been refined
- New features like `useScroll` have been enhanced

**Migration:**
- Test all animations, especially complex ones
- Review any custom variants
- Check for deprecated APIs

### Three.js (v0.158 → v0.161)

**Breaking Changes:**
- Some material properties may have changed
- WebGLRenderer parameters might need updates
- Check for deprecated methods

**Migration:**
- Test all 3D scenes thoroughly
- Review console for deprecation warnings
- Update any custom shaders if necessary

### tailwind-merge (v1 → v2)

**Breaking Changes:**
- Some class merging behavior has changed
- Different handling of arbitrary values

**Migration:**
- Test components using `cn()` utility
- Check for unexpected styling issues

## General Update Process

1. Update dependencies: `npm install` or `yarn`
2. Run the application in development mode: `npm run dev`
3. Check for console warnings and errors
4. Test all major features and components
5. Build the application: `npm run build`
6. Test the production build: `npm start`

## Troubleshooting

If you encounter issues after updating:

1. Check the specific package's changelog or release notes
2. Try updating dependencies one at a time to isolate problems
3. Consider using `npm ci` to ensure clean installs
4. Clear cache: `npm cache clean --force`
