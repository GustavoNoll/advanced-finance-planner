---
name: i18n
description: Add and maintain internationalization for English and Portuguese. Use when creating new UI text, labels, messages, or error strings. Always provide translations for both en and pt.
---

# i18n - Internationalization

## Requirement

All user-facing text must support English (en) and Portuguese (pt).

## Implementation

1. **Add keys** to `packages/frontend/src/locales/pt-BR.ts` and `packages/frontend/src/locales/en-US.ts`
2. **Use translation hook** for rendering: `useTranslation()` or equivalent from project i18n setup
3. **Never hardcode** user-facing strings in components

## Translation File Structure

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "feature.key": "Translated text"
}
```

## Example

```tsx
// ❌ BAD
<button>Salvar</button>

// ✅ GOOD
const { t } = useTranslation()
<button>{t('common.save')}</button>
```

Add both `en` and `pt` entries for each key.

## Checklist

- [ ] New text added to en and pt locale files
- [ ] Component uses translation function
- [ ] No hardcoded user-facing strings
