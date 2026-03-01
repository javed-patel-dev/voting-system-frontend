# 🎯 Quick Reference: Auto-Format on Save

## ⚡ What You Need to Know

### Press `Ctrl + S` and Get:

✅ **Formatted Code** - Prettier cleans up your code structure  
✅ **Sorted Imports** - Imports organized alphabetically by group  
✅ **Unused Removed** - Unused variables and imports deleted  
✅ **ESLint Fixed** - Auto-fixable linting errors corrected

---

## 🚀 Quick Start

1. **Install Extensions** (one-time setup)
   - Open Extensions: `Ctrl+Shift+X`
   - Install: **Prettier**, **ESLint**
   - Reload VS Code: `Ctrl+Shift+P` → "Reload Window"

2. **Press `Ctrl+S`** - That's it!

---

## 📋 Commands

| Command            | What It Does                   |
| ------------------ | ------------------------------ |
| `Ctrl+S`           | Save + Format + Fix + Organize |
| `npm run format`   | Format all files manually      |
| `npm run lint:fix` | Fix all ESLint issues          |
| `npm run lint`     | Check for issues               |

---

## 🎨 Format Rules

- **Line Width**: 100 characters
- **Indentation**: 2 spaces
- **Quotes**: Double quotes `"`
- **Semicolons**: Yes `;`
- **Trailing Commas**: ES5 style

---

## 📦 Import Order (Auto-Sorted)

```typescript
// 1. React (always first)
import { useState } from "react";

// 2. External packages
import { useNavigate } from "react-router-dom";

// 3. Internal (@/ imports) - alphabetical
import { Button } from "@/components/ui/button";
import adminService from "@/services/adminService";
import { toast } from "@/utils/toast";

// 4. Relative imports
import { helper } from "../utils/helper";
import { type } from "./types";
```

---

## 🔧 Files Created

- ✅ `.vscode/settings.json` - VS Code auto-format config
- ✅ `.prettierrc` - Prettier formatting rules
- ✅ `eslint.config.js` - Enhanced with import/unused rules
- ✅ `FORMAT_ON_SAVE_SETUP.md` - Full documentation

---

## ⚠️ Keep These Variables

Use `_` prefix for intentionally unused:

```typescript
const _keepThis = "won't be removed";
function example(_unusedParam) {} // kept
```

---

## 🐛 If Not Working

1. **Reload Window**: `Ctrl+Shift+P` → "Reload Window"
2. **Check Extensions**: Prettier & ESLint installed?
3. **Check Settings**: `Ctrl+,` → search "format on save"

---

## 💡 Pro Tips

- Files format **instantly** on save
- Works on **all file types** (.ts, .tsx, .js, .jsx, .json)
- **Whole team** gets same formatting
- **Git diffs** stay clean

---

**Ready to go!** Just press `Ctrl+S` 🚀
