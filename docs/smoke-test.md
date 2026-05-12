# Smoke Test Checklist

Use this checklist to verify the system's health after a new deployment or local setup.

## 1. Authentication & Security
- [ ] Login page loads correctly in all 3 languages.
- [ ] Registering a new user works and redirects to profile/dashboard.
- [ ] Unauthorized users cannot access `/dashboard` routes.
- [ ] Logout works and clears the session.
- [ ] Role-based navigation: Admin see "Users", Managers see "Review" tabs, Owners don't.

## 2. Localization
- [ ] Language switcher changes all text (navigation, buttons, forms).
- [ ] Dates and numbers are formatted correctly (where applicable).
- [ ] Error messages are localized.

## 3. Property Management
- [ ] "Register Property" form can be submitted.
- [ ] Property status changes from `DRAFT` to `SUBMITTED`.
- [ ] Documents can be uploaded and viewed.
- [ ] Manager can approve/reject a property.

## 4. Tax Assessments
- [ ] Tax rates can be viewed/edited by Admin/Manager.
- [ ] "Generate Assessment" creates a record with correct math (Land Size * Rate).
- [ ] Assessment status is `ISSUED`.

## 5. Payments
- [ ] User can see their assessments in the dashboard.
- [ ] "Pay" button opens the payment selection.
- [ ] Sinqee Bank receipt upload works (file saved and record created).
- [ ] Manager can see pending payments.
- [ ] Verifying a payment updates the assessment to `PAID`.

## 6. Confirmations
- [ ] Official confirmation is generated after payment verification.
- [ ] Confirmation can be viewed/printed.
- [ ] Confirmation number is unique and follows the required format.

## 7. Reports & Dashboard
- [ ] Dashboard cards show correct totals (Properties, Assessments, etc.).
- [ ] Analytics charts render correctly.
- [ ] Data reflects real database records seeded/created.

## 8. API & System
- [ ] Backend health check returns 200 OK.
- [ ] No console errors on frontend during normal use.
- [ ] Database migrations are up to date.
