CENTENNIAL APARTMENTS - WEBSITE GUIDE
======================================

Welcome to your fully functional Centennial Apartments property management system with REAL-TIME data synchronization!

## WEBSITE STRUCTURE

### 1. HOMEPAGE (index.html)
- Professional hero section with building branding
- Available units showcase with filters (All, Studio, 1BR, 2BR)
- About section highlighting key features
- Clean navigation with Tenant Login and Admin buttons
- Responsive design that looks great on all devices

### 2. TENANT PORTAL (tenant-portal.html)
Access with credentials:
- Email: tenant@example.com
- Password: password

Features:
- ■ Dashboard: Quick overview of unit info and pending bills
- ■ Bills & Payments: Monthly rent, utilities, and payment history
- ● Announcements: Community updates (SYNCED with admin in real-time!)
- ▼ Maintenance Requests: Submit NEW requests + track status
- ● Report Issues: Report problems (noise, cleanliness, etc.)
- ◇ Documents: Access lease, rules, emergency procedures

### 3. ADMIN DASHBOARD (admin-dashboard.html)
Access with credentials:
- Email: admin@example.com
- Password: SecureAdmin@2026

Features:
- ■ Dashboard: Overview of occupancy, revenue, and pending tasks
- ◇ Manage Tenants: Fully functional - add/edit/remove tenants
- ⌂ Manage Units: Fully functional - add/edit/assign/unassign units
- ▼ Maintenance Requests: View and update request status (tenants see updates immediately!)
- ● Tenant Reports: View and resolve complaints (tenants see status updates!)
- ▲ Announcements: Create/edit/delete announcements (tenants see them instantly!)
- ◄ Billing & Payments: Track and manage billing

## HOW REAL-TIME SYNCHRONIZATION WORKS

### Interconnected Data Flow:
1. **Admin creates an announcement** → Saved to localStorage
2. **Tenant views announcements** → Pulls from same localStorage
3. **Result**: Tenant sees admin's announcement IMMEDIATELY on next page refresh
4. **Same logic applies to**: Requests, reports, bills, tenants, units

The system uses **shared data structures** (announcements, maintenanceRequests, tenantReports, etc.) that automatically sync across all portals through localStorage persistence.

## TESTING THE FULL SYSTEM - REAL-TIME SYNC DEMO

### Test 1: Admin Announcement Sync
1. **Admin logs in** (admin@example.com / SecureAdmin@2026)
2. Click "Announcements" section
3. Click "Create New Announcement" button
4. Fill in:
   - Title: "Important Maintenance Scheduled"
   - Content: "Pipe inspection scheduled for April 20-21"
5. Click "Create Announcement" - Announcement saves to localStorage
6. **Logout** (click Logout button)
7. **Tenant logs in** (tenant@example.com / password)
8. Click "Announcements" section
9. **You see the admin's announcement!** ✓ Real-time sync working

### Test 2: Tenant Request Submission
1. Tenant portal → "Maintenance Requests" section
2. Click "Create New Request" button
3. Select issue type: "Plumbing"
4. Description: "Kitchen sink leaking"
5. Preferred contact: "Email"
6. Click "Submit Request" - Request saves to localStorage
7. **Logout**
8. **Admin logs in** → "Maintenance Requests" section
9. **Admin sees the tenant's new request!** ✓ Instant visibility

### Test 3: Admin Request Status Update
1. Admin in "Maintenance Requests" section
2. Find the tenant's request
3. Click "Start" button to change status to "In Progress"
4. **Logout**
5. **Tenant logs in** → "Maintenance Requests"
6. **Tenant sees status changed to "In Progress"!** ✓ Real-time update

### Test 4: Full Property Management Workflow
1. **Admin**: Create new tenant (Manage Tenants → Add New Tenant)
2. **Admin**: Assign tenant to available unit
3. **Admin**: Create bill for new tenant
4. **Logout & Tenant Login**
5. Tenant sees bills in "Bills & Payments" section
6. Tenant receives announcements
7. Tenant can submit maintenance requests
8. **Logout & Admin Login**
9. Admin sees all tenant activity immediately

## DATA PERSISTENCE & STRUCTURE

All data persists in **localStorage** with these keys:
- `announcements` - All building announcements
- `maintenanceRequests` - All maintenance requests from tenants
- `tenantReports` - All tenant reports/complaints
- `tenants` - Tenant database
- `units` - Property units database
- `bills` - All billing records
- `registeredUsers` - Registered inquiry users
- `currentUser` - Currently logged in user session

**NOTE**: localStorage is browser-based and persists until manually cleared. For production, replace with a proper backend database.

## KEY FEATURES & HOW THEY WORK

### For Tenants:
✓ View available units before signing lease
✓ See all admin announcements in real-time
✓ Track all monthly bills and payments
✓ Submit NEW maintenance requests (admin sees them immediately!)
✓ Report issues confidentially (admin updates status instantly visible to you!)
✓ Download important documents

### For Administrators:
✓ Manage all tenant accounts (Add/Edit/Remove)
✓ Manage units (Add/Edit/Assign/Unassign tenants)
✓ Track unit occupancy and availability (auto-updates)
✓ Process maintenance requests and update status (tenants see updates!)
✓ Handle tenant complaints and reports (mark as resolved)
✓ Create announcements instantly visible to all tenants
✓ Monitor payment status and mark bills as paid

## DEMO CREDENTIALS

TENANT LOGIN:
- Email: tenant@example.com
- Password: password

ADMIN LOGIN:
- Email: admin@example.com
- Password: SecureAdmin@2026

INQUIRY REGISTRATION:
- Users can register with their details to login for submitting inquiries
- Registered users can login with their email and password

## CUSTOMIZATION TIPS

### Update Unit Listings:
Edit index.html units-grid section with your actual units

### Update Tenant Data:
Edit tenant-portal.html dashboard cards with real tenant information

### Update Admin Dashboard:
Edit admin-dashboard.html stats and tables with your building data

### Colors & Branding:
- Primary Color: #2d3436 (Dark)
- Accent Color: #ff9800 (Orange)
- Admin Color: #c0392b (Red)

Edit :root in styles.css to change colors

## PAGES BREAKDOWN

- index.html: Main homepage
- tenant-portal.html: Tenant login area & portal
- admin-dashboard.html: Admin management interface
- styles.css: All styling
- script.js: All functionality and interactions (1550 lines - fully functional backend logic)
- hero.jfif: Header/hero image
- booking.html, contact.html, units.html: Additional pages (existing)

## RESPONSIVE DESIGN

The website is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (Below 768px)

Sidebar collapses to horizontal tabs on mobile devices

## SECURITY NOTES

⚠️ IMPORTANT: This is a demo site with hardcoded credentials
For production use:
- Implement proper authentication (JWT, OAuth, etc.)
- Use secure password hashing
- Add data encryption
- Implement database storage
- Add HTTPS
- Implement proper authorization checks

## FILE LOCATIONS

All files are in: c:\Users\Administrator\Documents\FOR WEBSITE\

Run a local server to test:
- Python: python -m http.server 8000
- Node.js: npx http-server
- VS Code: Use Live Server extension

## IMPLEMENTATION DETAILS

### Backend Architecture:
- **No backend server required** - fully client-side with localStorage
- **Data structures shared** between tenant and admin portals
- **Real-time sync** through localStorage persistence
- **Authentication** via hardcoded credentials (demo only)
- **CRUD operations** for announcements, tenants, units, requests, reports

### Fully Implemented Functions:
- Admin: createAnnouncement, editAnnouncement, deleteAnnouncement
- Admin: submitAddTenant, updateTenant, removeTenant
- Admin: submitAddUnit, updateUnit, assignTenant, unassignUnitTenant
- Admin: updateRequestStatus, resolveReport, markBillPaid
- Tenant: submitMaintenanceRequest, submitIssueReport
- All data automatically saved to localStorage
- All changes instantly reflected across portals

## NEXT STEPS

1. Update demo credentials with real ones
2. Customize tenant and unit data
3. Replace localStorage with proper database when ready for production

2. Connect to backend database
3. Implement real payment processing
4. Add email notifications
5. Customize content for your building
6. Test thoroughly with real data

---
Built with HTML5, CSS3, and Vanilla JavaScript
Last Updated: April 2026
