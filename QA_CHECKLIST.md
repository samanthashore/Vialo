# Pyn App — QA Checklist

## Phase 1: Color Theme ✓
- [x] Error color updated (#d6453c → #b5503e)
- [x] Syringe fill gradient matches Pyn butter theme
- [x] Confetti colors match Pyn palette (butter, neutrals, spruce, success)
- [x] AuthGate.jsx left untouched (butter theme preserved)

## Phase 2: Account/Profile Screen ✓
- [ ] **Test:** Tap profile avatar in Today header → Account sheet opens
- [ ] **Test:** View user's name, email, member since date
- [ ] **Test:** Edit name → save → reflected in avatar initials
- [ ] **Test:** Connected care section shows clinic info (if connected)
- [ ] **Test:** Manage clinic button opens clinic connection dialog
- [ ] **Test:** Preferences section: notifications toggle, units selector (lb/kg), reminder time picker
- [ ] **Test:** Delete account with confirmation → fully removes user data

## Phase 3: Clinic Display Simplified ✓
- [ ] **Test:** Today screen no longer shows bulky ClinicBanner
- [ ] **Test:** Clinic info moved to Account → Connected care section
- [ ] **Test:** Spruce accent color (#2f5d5a) applied to clinic card
- [ ] **Test:** Shop & reorder button works (links to clinic store)
- [ ] **Test:** Stacks screen still shows ClinicBanner (for peptide catalog access)

## Phase 4: Today Logging Overhaul ✓
- [ ] **Test:** Click pending dose → SitePicker opens
- [ ] **Test:** Pick injection site → dose logs → undo toast appears (3s)
- [ ] **Test:** Tap undo toast → dose is unlogged
- [ ] **Test:** X button removed from dose cards (no delete affordance)
- [ ] **Test:** Click logged dose → DoseDetail sheet opens
- [ ] **Test:** DoseDetail shows dose name, schedule, time, site, remove option
- [ ] **Test:** Remove from today → removes from schedule only (can view in History)
- [ ] **Test:** All doses logged → "All done for today" message with confetti

## Phase 5: Polish & Details ✓
- [ ] **Test:** DoseDetailSheet displays all dose info
- [ ] **Test:** Site rotation shown in DoseDetailSheet
- [ ] **Test:** Schedule list only shows pending doses (logged doses removed)
- [ ] **Test:** App builds without errors: `npm run build`

## Phase 6: End-to-End Testing

### Sign Up & Onboarding
- [ ] **Test:** Sign up with new email → confirmation email → click link → login
- [ ] **Test:** Verify error on duplicate email: "Email already registered"
- [ ] **Test:** Verify weak password error: "Password must be at least 6 characters"
- [ ] **Test:** New user lands on Today screen with "no peptides" state
- [ ] **Test:** Add a peptide → verify it appears immediately

### Data Persistence
- [ ] **Test:** Log some doses → sign out → sign in with same email → data intact
- [ ] **Test:** Edit peptide name → save → close app → reopen → name persists
- [ ] **Test:** Add metrics (weight, energy, labs) → persist after refresh

### Navigation & Tabs
- [ ] **Test:** All 5 bottom tabs work: Today, Stacks, Tools, Pairings, Insights
- [ ] **Test:** Today → can add peptide, log doses, view history
- [ ] **Test:** Stacks → can add/edit/delete peptides, browse protocols
- [ ] **Test:** Tools → Draw calculator works, Backup export works
- [ ] **Test:** Pairings → AI analysis runs (requires Claude API), shows results
- [ ] **Test:** Insights → shows trends, recovery, weight, labs, achievements

### Account & Settings
- [ ] **Test:** Profile avatar in Today header → Account sheet
- [ ] **Test:** Edit name → saves to Supabase user_metadata
- [ ] **Test:** Units selector (lb/kg) → used in weight tracking
- [ ] **Test:** Sign out → logs out, redirects to login
- [ ] **Test:** Delete account → removes all user data, signs out

### Dose Logging Flow
- [ ] **Test:** Click pending dose → SitePicker
- [ ] **Test:** Pick site → dose logs with site saved
- [ ] **Test:** Undo toast appears → tap to undo
- [ ] **Test:** Click logged dose → DoseDetail sheet
- [ ] **Test:** DoseDetail shows injection site used
- [ ] **Test:** History tab → shows logged doses with dates/sites
- [ ] **Test:** All today's doses logged → "All done for today" + confetti

### Clinic Integration
- [ ] **Test:** If clinic connected: Connect clinic dialog → select clinic
- [ ] **Test:** Clinic name appears in Account → Connected care
- [ ] **Test:** Manage clinic button → opens ClinicSheet
- [ ] **Test:** Stacks shows clinic catalog products
- [ ] **Test:** Shop & reorder button → links to clinic store

### iOS Native Build
- [ ] **Test:** Build command: `npm run build:ios`
- [ ] **Test:** Run `npx cap sync ios`
- [ ] **Test:** Open in Xcode: `npx cap open ios`
- [ ] **Test:** Run on iPhone simulator
- [ ] **Test:** API base correctly set to `https://www.pynhealth.com` for native
- [ ] **Test:** Login works on device
- [ ] **Test:** Dose logging works on device
- [ ] **Test:** All tabs accessible on device
- [ ] **Test:** Capacitor storage persists (logs, peptides, metrics)

### Favicon & Branding
- [ ] **Test:** Browser tab shows PYN icon (favicon)
- [ ] **Test:** URL bar shows PYN butter color
- [ ] **Test:** Home screen shortcut uses PYN icon
- [ ] **Test:** Apple-touch-icon appears when added to home screen

## Known Limitations & Future Work
- Chunk size warning on build (performance optimization, not blocking)
- Empty states for History/Insights could be more elaborate
- Site rotation analytics in Insights not yet implemented
- Email confirmation flow depends on Supabase email provider setup

## Deployment Checklist
- [ ] Verify Supabase production database is configured
- [ ] Check Supabase email provider (for sign-up confirmations)
- [ ] Set `VITE_API_BASE=https://www.pynhealth.com` for native builds
- [ ] Deploy web app to Vercel (connected to GitHub)
- [ ] Test Capacitor iOS build locally before submitting to App Store
- [ ] Ensure App Store bundle ID matches: `com.pynhealth.app`
