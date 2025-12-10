#!/bin/bash

# Security Verification Script
# Run this before committing to ensure no credentials are exposed

echo "🔒 Running Security Checks..."
echo ""

ERRORS=0

# Check 1: Verify .env is ignored
echo "📋 Check 1: Verifying .env is gitignored..."
if git check-ignore .env > /dev/null 2>&1; then
    echo "   ✅ .env is properly ignored"
else
    echo "   ❌ ERROR: .env is NOT ignored!"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Verify google-services.json is ignored
echo "📋 Check 2: Verifying google-services.json is gitignored..."
if git check-ignore google-services.json > /dev/null 2>&1; then
    echo "   ✅ google-services.json is properly ignored"
else
    echo "   ❌ ERROR: google-services.json is NOT ignored!"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: Verify .env is not tracked
echo "📋 Check 3: Verifying .env is not tracked by git..."
if git ls-files --error-unmatch .env > /dev/null 2>&1; then
    echo "   ❌ ERROR: .env is tracked by git!"
    echo "   Run: git rm --cached .env"
    ERRORS=$((ERRORS + 1))
else
    echo "   ✅ .env is not tracked"
fi

# Check 4: Verify google-services.json is not tracked
echo "📋 Check 4: Verifying google-services.json is not tracked..."
if git ls-files --error-unmatch google-services.json > /dev/null 2>&1; then
    echo "   ❌ ERROR: google-services.json is tracked by git!"
    echo "   Run: git rm --cached google-services.json"
    ERRORS=$((ERRORS + 1))
else
    echo "   ✅ google-services.json is not tracked"
fi

# Check 5: Search for hardcoded API keys in staged files
echo "📋 Check 5: Scanning staged files for API keys..."
# Exclude documentation files and only check source code
if git diff --cached --name-only | grep -E "\.(ts|tsx|js)$" | xargs grep -E "gsk_[a-zA-Z0-9]{50,}" 2>/dev/null; then
    echo "   ❌ ERROR: Found actual API key in staged source files!"
    ERRORS=$((ERRORS + 1))
else
    echo "   ✅ No real API keys found in source files"
fi

# Check 6: Verify example files exist
echo "📋 Check 6: Verifying example template files exist..."
if [ -f ".env.example" ] && [ -f "google-services.example.json" ]; then
    echo "   ✅ Example templates exist"
else
    echo "   ⚠️  WARNING: Example templates missing"
fi

# Check 7: Verify .env has required variables
echo "📋 Check 7: Verifying .env has required variables..."
if [ -f ".env" ]; then
    if grep -q "EXPO_PUBLIC_GROQ_API_KEY" .env; then
        echo "   ✅ GROQ_API_KEY found in .env"
    else
        echo "   ⚠️  WARNING: GROQ_API_KEY not found in .env"
    fi
else
    echo "   ⚠️  WARNING: .env file not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo "✅ All security checks passed!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Safe to commit."
    exit 0
else
    echo "❌ $ERRORS security issue(s) found!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Please fix issues before committing."
    exit 1
fi
