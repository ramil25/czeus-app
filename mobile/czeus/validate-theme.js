#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🎨 Validating mobile theme colors...\n');

// Read the Colors.ts file
const colorsPath = path.join(__dirname, 'constants/Colors.ts');
const colorsContent = fs.readFileSync(colorsPath, 'utf8');

// Check if the light blue color is updated
const hasLightBlue = colorsContent.includes('#2362c7');
const hasOldColor = colorsContent.includes('#0a7ea4');

console.log('✅ Colors.ts validation:');
console.log(`   - Light blue color (#2362c7): ${hasLightBlue ? '✅ Found' : '❌ Missing'}`);
console.log(`   - Old color (#0a7ea4): ${hasOldColor ? '❌ Still present' : '✅ Removed'}`);

// Check ThemedText component
const themedTextPath = path.join(__dirname, 'components/ThemedText.tsx');
const themedTextContent = fs.readFileSync(themedTextPath, 'utf8');

const hasBlackTitles = themedTextContent.includes('#000000');
const hasSubtitleColor = themedTextContent.includes('subtitle');
const hasLinkColorUpdate = themedTextContent.includes('#2362c7');

console.log('\n✅ ThemedText.tsx validation:');
console.log(`   - Black titles (#000000): ${hasBlackTitles ? '✅ Found' : '❌ Missing'}`);
console.log(`   - Subtitle color handling: ${hasSubtitleColor ? '✅ Found' : '❌ Missing'}`);
console.log(`   - Updated link color: ${hasLinkColorUpdate ? '✅ Found' : '❌ Missing'}`);

// Check CzeusLogo component
const logoPath = path.join(__dirname, 'components/ui/CzeusLogo.tsx');
const logoExists = fs.existsSync(logoPath);

console.log('\n✅ CzeusLogo component validation:');
console.log(`   - Component exists: ${logoExists ? '✅ Found' : '❌ Missing'}`);

if (logoExists) {
  const logoContent = fs.readFileSync(logoPath, 'utf8');
  const hasLightBlueBackground = logoContent.includes('#2362c7');
  console.log(`   - Uses light blue background: ${hasLightBlueBackground ? '✅ Found' : '❌ Missing'}`);
}

// Check signup screen
const signupPath = path.join(__dirname, 'app/(auth)/signup.tsx');
const signupContent = fs.readFileSync(signupPath, 'utf8');

const signupUsesLogo = signupContent.includes('CzeusLogo');
const signupUsesNewColor = signupContent.includes('#2362c7');
const signupHasOldColor = signupContent.includes('#3b82f6');

console.log('\n✅ Signup screen validation:');
console.log(`   - Uses CzeusLogo: ${signupUsesLogo ? '✅ Found' : '❌ Missing'}`);
console.log(`   - Uses new color: ${signupUsesNewColor ? '✅ Found' : '❌ Missing'}`);
console.log(`   - Has old color: ${signupHasOldColor ? '❌ Still present' : '✅ Removed'}`);

console.log('\n🎉 Theme validation complete!');

// Summary
const allGood = hasLightBlue && !hasOldColor && hasBlackTitles && logoExists && signupUsesLogo && signupUsesNewColor && !signupHasOldColor;
console.log(`\n📋 Overall status: ${allGood ? '✅ All checks passed!' : '⚠️ Some issues found'}`);