# Development Guidelines

## Localization (i18n)
The system supports three languages:
- **English (en)**
- **Amharic (am)**
- **Afaan Oromoo (om)**

### Rules for Future Modules
From now on, every new frontend feature must:
1. **Use the Shared UI Design System**: Adhere to the polished layout and components (Shadcn/UI based).
2. **Avoid Hardcoded Text**: Use dictionary keys for all user-facing strings.
3. **Provide 3-Language Translations**: Ensure `en.ts`, `am.ts`, and `om.ts` are updated for every new key.
4. **Reuse Shared Components**: Use existing status badges, buttons, forms, and tables.
5. **Full-Page Forms**: Keep long forms (e.g., Assessment creation) as separate pages, not large dialogs.
6. **RBAC Awareness**: Ensure navigation and actions are visible only to authorized roles.

### Dictionary Usage
Access translations using the `dict` object passed to pages or components:
```tsx
// Example
<span>{dict.common.save}</span>
```

### Module Status
Current modules requiring full localization support:
- Dashboard
- Location Categories
- Tax Rates
- Properties
- Property Documents
- Tax Assessments
- *Upcoming*: Payments
- *Upcoming*: Confirmations
