#!/bin/bash

# Verification script for API configuration fixes
echo "Verifying API configuration fixes..."

# Check if we're in the right directory
if [ ! -f "web/src/config.ts" ]; then
  echo "Error: This script must be run from the project root directory"
  exit 1
fi

echo "1. Checking for localhost:8080 references..."
if grep -r "localhost:8080" web/src/ --exclude-dir=node_modules; then
  echo "❌ Found localhost:8080 references"
  exit 1
else
  echo "✅ No localhost:8080 references found"
fi

echo "2. Checking for double /api/api/ references..."
if grep -r "/api/api/" web/src/ --exclude-dir=node_modules; then
  echo "❌ Found double /api/api/ references"
  exit 1
else
  echo "✅ No double /api/api/ references found"
fi

echo "3. Checking for direct axios usage..."
if grep -r "axios\." web/src/ --exclude-dir=node_modules | grep -v "http.ts"; then
  echo "❌ Found direct axios usage (should use http instance)"
  exit 1
else
  echo "✅ No direct axios usage found (outside of http.ts)"
fi

echo "4. Checking config.ts for proper configuration..."
if grep -q "window.__ENV?.API_BASE_URL" web/src/config.ts && grep -q "import.meta.env.VITE_API_BASE_URL" web/src/config.ts; then
  echo "✅ config.ts has proper configuration precedence"
else
  echo "❌ config.ts missing proper configuration precedence"
  exit 1
fi

echo "5. Checking for http.ts file..."
if [ -f "web/src/http.ts" ]; then
  echo "✅ http.ts file exists"
else
  echo "❌ http.ts file missing"
  exit 1
fi

echo "6. Checking for env.js file..."
if [ -f "web/public/env.js" ]; then
  echo "✅ env.js file exists"
else
  echo "❌ env.js file missing"
  exit 1
fi

echo "7. Checking index.html for env.js inclusion..."
if grep -q "env.js" web/index.html; then
  echo "✅ index.html includes env.js"
else
  echo "❌ index.html missing env.js inclusion"
  exit 1
fi

echo "✅ All verification checks passed!"
echo ""
echo "To test in browser:"
echo "1. Build the application: cd web && npm run build"
echo "2. Serve the application: npm run preview"
echo "3. Open DevTools and check Network tab for API calls"
echo "4. Verify all calls go to /api/... and not localhost:8080"
echo ""
echo "To test runtime configuration:"
echo "1. Edit web/public/env.js to change API_BASE_URL"
echo "2. Rebuild and verify the new base URL is used"