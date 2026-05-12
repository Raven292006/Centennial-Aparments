const STORAGE_KEYS = {
  currentUser: 'currentUser',
  registeredUsers: 'registeredUsers',
  announcements: 'announcements',
  maintenanceRequests: 'maintenanceRequests',
  tenantReports: 'tenantReports',
  tenants: 'tenants',
  units: 'units',
  bills: 'bills',
  bookings: 'bookings',
  paymentSubmissions: 'paymentSubmissions',
  paymentEmails: 'paymentEmails',
  contactMessages: 'contactMessages',
  selectedBookingUnit: 'selectedBookingUnit'
};

const PAYMENT_SETTINGS = {
  gcashNumber: '0917-555-0123',
  gcashName: 'Centennial Apartments Demo',
  proofWindowHours: 24
};

const BOOKING_PRICES = {
  studio: 800,
  '1bed': 1000,
  '2bed': 1200
};

const DEFAULT_DATA = {
  registeredUsers: [],
  announcements: [
    {
      id: 'ANN-001',
      title: 'Welcome to Centennial Apartments',
      content: 'Welcome to our community. Please review the house rules and emergency procedures.',
      date: '2026-04-01',
      published: true
    }
  ],
  maintenanceRequests: [
    {
      id: 'REQ-001',
      tenantId: 'T001',
      tenantName: 'John Doe',
      unit: 'Unit 201',
      title: 'Leaky Faucet in Bathroom',
      description: 'Water is dripping from the bathroom sink faucet.',
      contactMethod: 'Email',
      status: 'in-progress',
      submittedDate: '2026-04-15',
      notes: 'Maintenance will visit on April 20.'
    }
  ],
  tenantReports: [
    {
      id: 'REP-001',
      tenantId: 'T001',
      tenantName: 'John Doe',
      unit: 'Unit 201',
      title: 'Noise Complaint',
      description: 'Excessive noise from Unit 202 late at night.',
      severity: 'Medium',
      status: 'in-review',
      submittedDate: '2026-04-12',
      notes: 'Admin is reviewing the report and will follow up.'
    }
  ],
  tenants: [
    {
      id: 'T001',
      name: 'John Doe',
      unit: 'Unit 201',
      email: 'tenant@example.com',
      phone: '(555) 123-4567',
      leaseStart: '2026-01-01',
      leaseEnd: '2026-12-31',
      status: 'active'
    }
  ],
  units: [
    {
      id: '101',
      number: 'Unit 101',
      type: 'Studio',
      floor: '1st Floor',
      size: '350 sq ft',
      tenantId: null,
      rent: 1200,
      status: 'available'
    },
    {
      id: '102',
      number: 'Unit 102',
      type: 'Studio',
      floor: '1st Floor',
      size: '350 sq ft',
      tenantId: null,
      rent: 1200,
      status: 'available'
    },
    {
      id: '201',
      number: 'Unit 201',
      type: '1 Bedroom',
      floor: '2nd Floor',
      size: '550 sq ft',
      tenantId: 'T001',
      rent: 1600,
      status: 'occupied'
    },
    {
      id: '202',
      number: 'Unit 202',
      type: '1 Bedroom',
      floor: '2nd Floor',
      size: '550 sq ft',
      tenantId: null,
      rent: 1600,
      status: 'available'
    },
    {
      id: '301',
      number: 'Unit 301',
      type: '2 Bedroom',
      floor: '3rd Floor',
      size: '750 sq ft',
      tenantId: null,
      rent: 2000,
      status: 'available'
    }
  ],
  bills: [
    {
      id: 'B001',
      tenantId: 'T001',
      month: 'April 2026',
      rent: 1200,
      utilities: 150,
      other: 0,
      total: 1350,
      status: 'unpaid',
      dueDate: '2026-04-25'
    },
    {
      id: 'B002',
      tenantId: 'T001',
      month: 'May 2026',
      rent: 1200,
      utilities: 180,
      other: 50,
      total: 1430,
      status: 'unpaid',
      dueDate: '2026-05-25'
    }
  ],
  bookings: [],
  paymentSubmissions: [],
  paymentEmails: [],
  contactMessages: []
};

let currentUser = null;
let registeredUsers = [];
let announcements = [];
let maintenanceRequests = [];
let tenantReports = [];
let tenants = [];
let units = [];
let bills = [];
let bookings = [];
let paymentSubmissions = [];
let paymentEmails = [];
let contactMessages = [];
let requestFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  refreshState();
  bindGlobalUi();
  initializeHomepage();
  initializeMarketingForms();
  initializeTenantPortal();
  initializeAdminPortal();
  syncAuthUi();

  window.addEventListener('storage', () => {
    refreshState();
    syncAuthUi();
    refreshActivePage();
  });

  window.setInterval(() => {
    refreshState();
    refreshActivePage();
  }, 60000);
});

function getStoredArray(key, fallback) {
  const raw = localStorage.getItem(key);

  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return clone(fallback);
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : clone(fallback);
  } catch (error) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return clone(fallback);
  }
}

function refreshState() {
  currentUser = safelyParseObject(localStorage.getItem(STORAGE_KEYS.currentUser));
  registeredUsers = getStoredArray(STORAGE_KEYS.registeredUsers, DEFAULT_DATA.registeredUsers);
  announcements = getStoredArray(STORAGE_KEYS.announcements, DEFAULT_DATA.announcements);
  maintenanceRequests = getStoredArray(STORAGE_KEYS.maintenanceRequests, DEFAULT_DATA.maintenanceRequests);
  tenantReports = getStoredArray(STORAGE_KEYS.tenantReports, DEFAULT_DATA.tenantReports);
  tenants = getStoredArray(STORAGE_KEYS.tenants, DEFAULT_DATA.tenants);
  units = getStoredArray(STORAGE_KEYS.units, DEFAULT_DATA.units);
  bills = getStoredArray(STORAGE_KEYS.bills, DEFAULT_DATA.bills);
  bookings = getStoredArray(STORAGE_KEYS.bookings, DEFAULT_DATA.bookings);
  paymentSubmissions = getStoredArray(STORAGE_KEYS.paymentSubmissions, DEFAULT_DATA.paymentSubmissions);
  paymentEmails = getStoredArray(STORAGE_KEYS.paymentEmails, DEFAULT_DATA.paymentEmails);
  contactMessages = getStoredArray(STORAGE_KEYS.contactMessages, DEFAULT_DATA.contactMessages);
  normalizePaymentStatuses();
  repairDataRelationships();
  expirePendingBookings();
}

function normalizePaymentStatuses() {
  let changedBills = false;
  let changedSubmissions = false;

  bills = bills.map(bill => {
    if (bill.status !== 'payment-submitted') return bill;
    changedBills = true;
    return {
      ...bill,
      status: 'pending'
    };
  });

  paymentSubmissions = paymentSubmissions.map(submission => {
    if (submission.status !== 'payment-submitted') return submission;
    changedSubmissions = true;
    return {
      ...submission,
      status: 'pending'
    };
  });

  if (changedBills) saveArray(STORAGE_KEYS.bills, bills);
  if (changedSubmissions) saveArray(STORAGE_KEYS.paymentSubmissions, paymentSubmissions);
}

function repairDataRelationships() {
  units = units.map(unit => {
    const tenant = tenants.find(item => item.id === unit.tenantId);
    const heldStatuses = ['reserved', 'confirmed'];
    return {
      ...unit,
      tenantId: tenant ? unit.tenantId : null,
      status: tenant ? 'occupied' : (heldStatuses.includes(unit.status) ? unit.status : 'available')
    };
  });

  tenants = tenants.map(tenant => {
    const assignedUnit = units.find(unit => unit.tenantId === tenant.id);
    return {
      ...tenant,
      unit: assignedUnit ? assignedUnit.number : tenant.unit || 'Unassigned'
    };
  });

  saveArray(STORAGE_KEYS.units, units);
  saveArray(STORAGE_KEYS.tenants, tenants);

  if (currentUser && currentUser.role === 'tenant') {
    const tenant = tenants.find(item => item.id === currentUser.id);
    if (tenant) {
      const tenantUnit = units.find(item => item.tenantId === tenant.id);
      currentUser = {
        ...currentUser,
        name: tenant.name,
        unit: tenant.unit,
        floor: tenantUnit ? tenantUnit.floor : 'Unassigned'
      };
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
    }
  }
}

function expirePendingBookings() {
  let changed = false;
  const now = Date.now();

  bookings = bookings.map(booking => {
    if (booking.status === 'pending' && booking.expiresAt && new Date(booking.expiresAt).getTime() <= now) {
      changed = true;
      if (booking.holdUnitId) releaseHeldUnit(booking.holdUnitId);
      return {
        ...booking,
        status: 'expired',
        expiredAt: new Date().toISOString()
      };
    }

    return booking;
  });

  if (changed) {
    saveArray(STORAGE_KEYS.bookings, bookings);
    saveArray(STORAGE_KEYS.units, units);
  }
}

function safelyParseObject(rawValue) {
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function saveArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function bindGlobalUi() {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      if (currentUser && currentUser.role === 'inquiry') {
        logout();
        return;
      }

      openAuthModal('inquiry');
    });
  }

  const registerBtn = document.getElementById('register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => openAuthModal('register'));
  }

  const inquiryLogoutBtn = document.getElementById('inquiry-logout-btn');
  if (inquiryLogoutBtn) {
    inquiryLogoutBtn.addEventListener('click', logout);
  }

  const bookingNavBtn = document.getElementById('booking-nav-btn');
  if (bookingNavBtn) {
    bookingNavBtn.addEventListener('click', () => {
      window.location.href = 'booking.html';
    });
  }

  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    loginLink.addEventListener('click', event => {
      event.preventDefault();
      openAuthModal('inquiry');
    });
  }

  const registerLink = document.getElementById('register-link');
  if (registerLink) {
    registerLink.addEventListener('click', event => {
      event.preventDefault();
      openAuthModal('register');
    });
  }

  const tenantLoginLink = document.getElementById('tenant-login-link');
  if (tenantLoginLink) {
    tenantLoginLink.addEventListener('click', event => {
      event.preventDefault();
      openAuthModal('tenant');
    });
  }

  const inquiryLoginLink = document.getElementById('inquiry-login-link');
  if (inquiryLoginLink) {
    inquiryLoginLink.addEventListener('click', event => {
      event.preventDefault();
      openAuthModal('inquiry');
    });
  }

  const authTabs = [
    ['login-tab-btn', 'inquiry'],
    ['tenant-tab-btn', 'tenant'],
    ['admin-tab-btn', 'admin'],
    ['register-tab-btn', 'register']
  ];

  authTabs.forEach(([id, type]) => {
    const tab = document.getElementById(id);
    if (tab) {
      tab.addEventListener('click', event => {
        event.preventDefault();
        openAuthModal(type);
      });
    }
  });

  const loginForm = document.getElementById('login-form-element');
  if (loginForm) loginForm.addEventListener('submit', handleInquiryLogin);

  const tenantForm = document.getElementById('tenant-form-element');
  if (tenantForm) tenantForm.addEventListener('submit', handleTenantLogin);

  const adminForm = document.getElementById('admin-form-element');
  if (adminForm) adminForm.addEventListener('submit', handleAdminLogin);

  const registerForm = document.getElementById('register-form-element');
  if (registerForm) registerForm.addEventListener('submit', handleRegister);

  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  const tenantLogoutBtn = document.getElementById('logout-btn');
  if (tenantLogoutBtn) tenantLogoutBtn.addEventListener('click', logout);

  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', logout);

  document.querySelectorAll('.nav-item:not(.admin-nav-item)').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      openTenantSection(item.dataset.section);
    });
  });

  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      openAdminSection(item.dataset.section);
    });
  });
}

function syncAuthUi() {
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const inquiryLogout = document.getElementById('inquiry-logout');

  if (currentUser && currentUser.role === 'inquiry') {
    if (loginBtn) {
      loginBtn.textContent = 'Logout';
      loginBtn.style.display = 'inline-block';
    }
    if (registerBtn) registerBtn.style.display = 'none';
    if (inquiryLogout) inquiryLogout.style.display = 'none';
    return;
  }

  if (loginBtn) {
    loginBtn.textContent = 'Login';
    loginBtn.style.display = 'inline-block';
  }
  if (registerBtn) registerBtn.style.display = 'inline-block';
  if (inquiryLogout) inquiryLogout.style.display = 'none';
}

function openAuthModal(type) {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  const forms = {
    inquiry: 'login-form',
    tenant: 'tenant-form',
    admin: 'admin-form',
    register: 'register-form'
  };

  Object.values(forms).forEach(id => {
    const form = document.getElementById(id);
    if (form) form.classList.remove('active');
  });

  const activeForm = document.getElementById(forms[type] || forms.inquiry);

  if (activeForm) activeForm.classList.add('active');

  document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
  const activeTabIds = {
    inquiry: 'login-tab-btn',
    tenant: 'tenant-tab-btn',
    admin: 'admin-tab-btn',
    register: 'register-tab-btn'
  };
  const activeTab = document.getElementById(activeTabIds[type]);
  if (activeTab) activeTab.classList.add('active');

  modal.classList.add('active');
}

function handleInquiryLogin(event) {
  event.preventDefault();

  const email = getInputValue('email-input');
  const password = getInputValue('password-input');

  if (!email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  const registeredUser = registeredUsers.find(user => user.email === email && user.password === password);

  if (registeredUser) {
    currentUser = {
      id: registeredUser.id,
      name: registeredUser.name,
      email: registeredUser.email,
      phone: registeredUser.phone,
      role: 'inquiry'
    };
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
    closeAuthModal();
    syncAuthUi();
    localStorage.removeItem(STORAGE_KEYS.selectedBookingUnit);
    alert('Logged in successfully. Your inquiry details are ready for booking forms.');
    redirectInquiryUserHome();
    return;
  }

  alert('Invalid credentials. Please verify your details or register first.');
}

function handleTenantLogin(event) {
  event.preventDefault();

  const email = getInputValue('tenant-email-input');
  const password = getInputValue('tenant-password-input');

  if (email === 'tenant@example.com' && password === 'password') {
    loginAsTenant();
    return;
  }

  if (email === 'admin@example.com' && password === 'SecureAdmin@2026') {
    loginAsAdmin();
    return;
  }

  alert('Invalid credentials. Use your tenant credentials or admin credentials.');
}

function handleAdminLogin(event) {
  event.preventDefault();

  const email = getInputValue('admin-email-input');
  const password = getInputValue('admin-password-input');

  if (email === 'admin@example.com' && password === 'SecureAdmin@2026') {
    loginAsAdmin();
    return;
  }

  alert('Invalid admin credentials.');
}

function handleRegister(event) {
  event.preventDefault();

  const name = getInputValue('reg-name');
  const email = getInputValue('reg-email');
  const phone = getInputValue('reg-phone');
  const password = getInputValue('reg-password');
  const confirmPassword = getInputValue('reg-confirm-password');

  if (!name || !email || !phone || !password || !confirmPassword) {
    alert('Please fill in all fields.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  if (registeredUsers.some(user => user.email === email)) {
    alert('This email is already registered.');
    return;
  }

  registeredUsers.push({
    id: `I${Date.now()}`,
    name,
    email,
    phone,
    password,
    role: 'inquiry'
  });

  saveArray(STORAGE_KEYS.registeredUsers, registeredUsers);
  refreshState();

  currentUser = {
    id: registeredUsers[registeredUsers.length - 1].id,
    name,
    email,
    phone,
    role: 'inquiry'
  };
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
  closeAuthModal();
  syncAuthUi();
  localStorage.removeItem(STORAGE_KEYS.selectedBookingUnit);
  alert('Registration successful. Your inquiry details will now auto-fill booking forms.');
  redirectInquiryUserHome();
}

function redirectInquiryUserHome() {
  if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && window.location.pathname !== '') {
    window.location.href = 'index.html';
  }
}

function loginAsTenant() {
  refreshState();

  const tenant = tenants.find(item => item.id === 'T001') || DEFAULT_DATA.tenants[0];
  const unit = units.find(item => item.tenantId === tenant.id);

  currentUser = {
    id: tenant.id,
    name: tenant.name,
    email: tenant.email,
    role: 'tenant',
    unit: tenant.unit,
    floor: unit ? unit.floor : 'Unassigned'
  };

  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
  closeAuthModal();
  window.location.href = 'tenant-portal.html';
}

function loginAsAdmin() {
  currentUser = {
    id: 'A001',
    name: 'Administrator',
    email: 'admin@example.com',
    role: 'admin'
  };

  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
  closeAuthModal();
  window.location.href = 'admin-dashboard.html';
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('active');
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  currentUser = null;
  window.location.href = 'index.html';
}

function getInputValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : '';
}

function initializeHomepage() {
  const exploreBtn = document.getElementById('explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      const unitsSection = document.getElementById('available-units');
      if (unitsSection) unitsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  document.querySelectorAll('.filter-btn[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      filterUnits(button.dataset.filter);
    });
  });

  // Initialize dropdown filters
  const floorFilter = document.getElementById('floor-filter');
  const bedroomFilter = document.getElementById('bedroom-filter');
  const budgetFilter = document.getElementById('budget-filter');
  const allUnitsBtn = document.getElementById('all-units-btn');

  if (floorFilter && bedroomFilter && budgetFilter) {
    [floorFilter, bedroomFilter, budgetFilter].forEach(filter => {
      filter.addEventListener('change', () => {
        filterUnits();
        // Remove active class from All Units button when filters are used
        if (allUnitsBtn) allUnitsBtn.classList.remove('active');
      });
    });
  }

  // All Units button functionality
  if (allUnitsBtn) {
    allUnitsBtn.addEventListener('click', () => {
      // Reset all dropdowns to "all"
      if (floorFilter) floorFilter.value = 'all';
      if (bedroomFilter) bedroomFilter.value = 'all';
      if (budgetFilter) budgetFilter.value = 'all';
      
      // Show all units
      filterUnits();
      
      // Make All Units button active
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      allUnitsBtn.classList.add('active');
    });
  }
}

function initializeMarketingForms() {
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    hydrateSelectedBookingUnit();
    hydrateInquiryBookingDetails();
    renderInquiryBookingPayments();
    bookingForm.addEventListener('submit', submitBooking);
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', submitContactMessage);
  }
}

function filterUnits() {
  const floorFilter = document.getElementById('floor-filter');
  const bedroomFilter = document.getElementById('bedroom-filter');
  const budgetFilter = document.getElementById('budget-filter');

  const selectedFloor = floorFilter ? floorFilter.value : 'all';
  const selectedBedroom = bedroomFilter ? bedroomFilter.value : 'all';
  const selectedBudget = budgetFilter ? budgetFilter.value : 'all';

  document.querySelectorAll('.unit-card[data-type]').forEach(card => {
    const cardFloor = card.dataset.floor;
    const cardType = card.dataset.type;
    const cardPrice = parseInt(card.dataset.price);

    let showCard = true;

    // Filter by floor
    if (selectedFloor !== 'all' && cardFloor !== selectedFloor) {
      showCard = false;
    }

    // Filter by bedroom type
    if (selectedBedroom !== 'all' && cardType !== selectedBedroom) {
      showCard = false;
    }

    // Filter by budget
    if (selectedBudget !== 'all') {
      const [minPrice, maxPrice] = selectedBudget.split('-').map(p => parseInt(p));
      if (cardPrice < minPrice || cardPrice > maxPrice) {
        showCard = false;
      }
    }

    card.style.display = showCard ? '' : 'none';
  });
}

const UNIT_PREVIEWS = {
  'Studio 101': {
    name: 'Studio - Unit 101',
    type: 'Studio',
    size: 350,
    beds: 1,
    baths: 1,
    description: 'A compact and modern studio with built-in storage, an efficient kitchenette, and bright finishes.',
    amenities: ['Furnished interior', 'Air conditioning', 'WiFi included', 'Modern bathroom', 'Laundry access'],
    price: 1200
  },
  'Studio 102': {
    name: 'Studio - Unit 102',
    type: 'Studio',
    size: 350,
    beds: 1,
    baths: 1,
    description: 'A bright studio plan designed for students and professionals who want comfort without wasted space.',
    amenities: ['Furnished interior', 'Air conditioning', 'WiFi included', 'Updated cabinetry', 'Secure entry'],
    price: 1200
  },
  '1BR 201': {
    name: '1 Bedroom - Unit 201',
    type: '1 Bedroom',
    size: 550,
    beds: 1,
    baths: 1,
    description: 'A spacious one-bedroom apartment with a private living area, full kitchen, and a comfortable bedroom retreat.',
    amenities: ['Private living room', 'Air conditioning', 'WiFi included', 'Balcony', 'Full kitchen'],
    price: 1600
  },
  '1BR 202': {
    name: '1 Bedroom - Unit 202',
    type: '1 Bedroom',
    size: 550,
    beds: 1,
    baths: 1,
    description: 'A warm one-bedroom layout with flexible living space, great natural light, and premium everyday finishes.',
    amenities: ['Private living room', 'Air conditioning', 'WiFi included', 'Balcony', 'Storage closet'],
    price: 1600
  },
  '1BR 203': {
    name: '1 Bedroom - Unit 203',
    type: '1 Bedroom',
    size: 550,
    beds: 1,
    baths: 1,
    description: 'A clean and modern one-bedroom designed for quiet, comfortable daily living close to building amenities.',
    amenities: ['Private living room', 'Air conditioning', 'WiFi included', 'Updated bath', 'Dining nook'],
    price: 1600
  },
  '2BR 301': {
    name: '2 Bedroom - Unit 301',
    type: '2 Bedroom',
    size: 750,
    beds: 2,
    baths: 2,
    description: 'A larger two-bedroom home with split sleeping areas and a generous shared living space.',
    amenities: ['Two bathrooms', 'Air conditioning', 'WiFi included', 'Balcony', 'Full kitchen'],
    price: 2000
  },
  '2BR 302': {
    name: '2 Bedroom - Unit 302',
    type: '2 Bedroom',
    size: 750,
    beds: 2,
    baths: 2,
    description: 'A premium two-bedroom with a bright open layout and extra room for families or roommates.',
    amenities: ['Two bathrooms', 'Air conditioning', 'WiFi included', 'Balcony', 'Large closets'],
    price: 2000
  },
  'Studio 401': {
    name: 'Studio - Unit 401',
    type: 'Studio',
    size: 320,
    beds: 1,
    baths: 1,
    description: 'A cozy fourth-floor studio with city views and modern amenities perfect for students.',
    amenities: ['Furnished interior', 'Air conditioning', 'WiFi included', 'City views', 'Compact design'],
    price: 1100
  },
  '1BR 402': {
    name: '1 Bedroom - Unit 402',
    type: '1 Bedroom',
    size: 520,
    beds: 1,
    baths: 1,
    description: 'A fourth-floor one-bedroom with stunning city views and premium finishes.',
    amenities: ['City views', 'Air conditioning', 'WiFi included', 'Balcony', 'Modern kitchen'],
    price: 1500
  },
  '2BR 403': {
    name: '2 Bedroom - Unit 403',
    type: '2 Bedroom',
    size: 780,
    beds: 2,
    baths: 2,
    description: 'A spacious fourth-floor two-bedroom with premium views and upgraded amenities.',
    amenities: ['Premium views', 'Air conditioning', 'WiFi included', 'Balcony', 'Two bathrooms'],
    price: 2200
  },
  '3BR 501': {
    name: '3 Bedroom - Unit 501',
    type: '3 Bedroom',
    size: 1100,
    beds: 3,
    baths: 2,
    description: 'A luxurious fifth-floor three-bedroom penthouse suite with panoramic views.',
    amenities: ['Panoramic views', 'Air conditioning', 'WiFi included', 'Two balconies', 'Premium amenities'],
    price: 2800
  },
  'Studio 502': {
    name: 'Studio - Unit 502',
    type: 'Studio',
    size: 380,
    beds: 1,
    baths: 1,
    description: 'A premium fifth-floor studio with penthouse location and modern comforts.',
    amenities: ['Penthouse location', 'Air conditioning', 'WiFi included', 'Premium finishes', 'Quiet floor'],
    price: 1300
  },
  '1BR 503': {
    name: '1 Bedroom - Unit 503',
    type: '1 Bedroom',
    size: 600,
    beds: 1,
    baths: 1,
    description: 'A fifth-floor one-bedroom with breathtaking views and penthouse amenities.',
    amenities: ['Penthouse views', 'Air conditioning', 'WiFi included', 'Balcony', 'Premium location'],
    price: 1800
  },
  '2BR 504': {
    name: '2 Bedroom - Unit 504',
    type: '2 Bedroom',
    size: 850,
    beds: 2,
    baths: 2,
    description: 'A stunning fifth-floor two-bedroom suite with premium finishes and views.',
    amenities: ['Premium suite', 'Air conditioning', 'WiFi included', 'Two balconies', 'Luxury finishes'],
    price: 2500
  },
  'Studio 103': {
    name: 'Studio - Unit 103',
    type: 'Studio',
    size: 300,
    beds: 1,
    baths: 1,
    description: 'A ground-floor studio with private entrance and easy access to amenities.',
    amenities: ['Ground floor', 'Air conditioning', 'WiFi included', 'Private entrance', 'Convenient access'],
    price: 1000
  },
  '3BR 404': {
    name: '3 Bedroom - Unit 404',
    type: '3 Bedroom',
    size: 1050,
    beds: 3,
    baths: 2,
    description: 'A spacious fourth-floor three-bedroom perfect for families or groups.',
    amenities: ['Family suite', 'Air conditioning', 'WiFi included', 'Balcony', 'Spacious layout'],
    price: 2600
  },
  '1BR 104': {
    name: '1 Bedroom - Unit 104',
    type: '1 Bedroom',
    size: 480,
    beds: 1,
    baths: 1,
    description: 'A ground-floor one-bedroom with private entrance and garden access.',
    amenities: ['Ground floor', 'Air conditioning', 'WiFi included', 'Private entrance', 'Garden access'],
    price: 1250
  },
  '2BR 205': {
    name: '2 Bedroom - Unit 205',
    type: '2 Bedroom',
    size: 720,
    beds: 2,
    baths: 2,
    description: 'A second-floor two-bedroom with updated kitchen and comfortable living spaces.',
    amenities: ['Updated kitchen', 'Air conditioning', 'WiFi included', 'Balcony', 'Comfortable layout'],
    price: 1900
  }
};

function viewUnitDetails(unitName) {
  const modal = document.getElementById('roomPreviewModal');
  const unit = UNIT_PREVIEWS[unitName];

  if (!modal || !unit) return;

  setText('previewUnitName', unit.name);
  setText('previewSqFt', unit.size);
  setText('previewBeds', unit.beds);
  setText('previewBaths', unit.baths);
  setText('previewDescription', unit.description);
  setText('previewPrice', formatCurrency(unit.price));
  setText('previewBadge', unit.type);

  const amenitiesList = document.getElementById('amenitiesList');
  if (amenitiesList) {
    amenitiesList.innerHTML = unit.amenities
      .map(item => `
        <div class="amenity-item">
          <span class="amenity-icon">+</span>
          <span class="amenity-text">${item}</span>
        </div>
      `)
      .join('');
  }

  localStorage.setItem(STORAGE_KEYS.selectedBookingUnit, unit.type.toLowerCase().includes('2') ? '2bed' : unit.type.toLowerCase().includes('1') ? '1bed' : 'studio');
  modal.classList.add('active');
}

function closeRoomPreview() {
  const modal = document.getElementById('roomPreviewModal');
  if (modal) modal.classList.remove('active');
}

function submitInquiry() {
  if (!currentUser || currentUser.role !== 'inquiry') {
    alert('Please log in with an inquiry account before submitting an inquiry.');
    openAuthModal('inquiry');
    return;
  }

  const unitName = document.getElementById('previewUnitName');
  alert(`Inquiry submitted for ${unitName ? unitName.textContent : 'this unit'}. Our team will contact you shortly.`);
  closeRoomPreview();
}

function scheduleViewing() {
  const previewName = document.getElementById('previewUnitName');
  const selectedLabel = previewName ? previewName.textContent : 'Selected unit';
  localStorage.setItem(STORAGE_KEYS.selectedBookingUnit, unitNameToBookingType(selectedLabel));
  closeRoomPreview();
  window.location.href = 'booking.html';
}

function unitNameToBookingType(label) {
  if (label.toLowerCase().includes('2 bedroom')) return '2bed';
  if (label.toLowerCase().includes('1 bedroom')) return '1bed';
  return 'studio';
}

function initializeTenantPortal() {
  if (!document.body.classList.contains('portal-body') || document.body.classList.contains('admin-body')) return;

  // For demo purposes, auto-login as tenant if not logged in
  if (!currentUser || currentUser.role !== 'tenant') {
    const tenant = tenants.find(item => item.id === 'T001') || DEFAULT_DATA.tenants[0];
    const unit = units.find(item => item.tenantId === tenant.id);

    currentUser = {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      role: 'tenant',
      unit: tenant.unit,
      floor: unit ? unit.floor : 'Unassigned'
    };
  }

  const tenant = tenants.find(item => item.id === currentUser.id);
  const unit = units.find(item => item.tenantId === currentUser.id);

  setText('tenant-name', currentUser.name);
  setText('tenant-dashboard-name', currentUser.name);
  setText('user-unit', tenant ? tenant.unit : currentUser.unit || 'Unassigned');
  setText('user-floor', unit ? unit.floor : currentUser.floor || 'Unassigned');
  setText('lease-start', tenant ? formatDisplayDate(tenant.leaseStart) : '--');
  setText('lease-end', tenant ? formatDisplayDate(tenant.leaseEnd) : '--');

  loadTenantAnnouncements();
  loadTenantRequests();
  loadTenantReports();
  loadTenantBills();
}

function loadTenantAnnouncements() {
  const list = document.querySelector('.announcements-list');
  if (!list) return;

  const publishedAnnouncements = announcements.filter(item => item.published);
  list.innerHTML = publishedAnnouncements
    .map(item => `
      <div class="announcement-item">
        <div class="announcement-header">
          <h3>${item.title}</h3>
          <span class="date">${formatDisplayDate(item.date)}</span>
        </div>
        <p>${item.content}</p>
      </div>
    `)
    .join('');

  setText('announcement-count', `${publishedAnnouncements.length} active notices`);
}

function loadTenantRequests() {
  const list = document.querySelector('.requests-list');
  if (!list || !currentUser) return;

  const tenantRequests = maintenanceRequests.filter(item => item.tenantId === currentUser.id);

  list.innerHTML = tenantRequests.length
    ? tenantRequests
        .map(item => `
          <div class="request-card">
            <div class="request-header">
              <h3>${item.title}</h3>
              <span class="request-id">${item.id}</span>
            </div>
            <p class="request-description">${item.description}</p>
            <div class="request-info">
              <span>Submitted: ${formatDisplayDate(item.submittedDate)}</span>
              <span class="status-badge ${statusClass(item.status)}">${item.status.replace('-', ' ')}</span>
              <span>Contact: ${item.contactMethod || 'Not provided'}</span>
            </div>
            <p class="request-note">Notes: ${item.notes || 'No updates yet.'}</p>
          </div>
        `)
        .join('')
    : '<div class="request-card"><p class="request-description">No maintenance requests have been submitted yet.</p></div>';

  const pendingCount = tenantRequests.filter(item => item.status !== 'completed').length;
  setText('pending-requests', `${pendingCount} active requests`);
}

function loadTenantReports() {
  const list = document.querySelector('.reports-list');
  if (!list || !currentUser) return;

  const reports = tenantReports.filter(item => item.tenantId === currentUser.id);
  list.innerHTML = reports.length
    ? reports
        .map(item => `
          <div class="report-card">
            <div class="report-header">
              <h3>${item.title}</h3>
              <span class="report-id">${item.id}</span>
            </div>
            <p class="report-description">${item.description}</p>
            <div class="report-info">
              <span>Submitted: ${formatDisplayDate(item.submittedDate)}</span>
              <span>Severity: ${item.severity || 'Not set'}</span>
              <span class="status-badge ${statusClass(item.status)}">${item.status.replace('-', ' ')}</span>
            </div>
            <p class="report-note">Notes: ${item.notes || 'No updates yet.'}</p>
          </div>
        `)
        .join('')
    : '<div class="report-card"><p class="report-description">No issue reports have been submitted yet.</p></div>';
}

function loadTenantBills() {
  const tbody = document.querySelector('.bills-table tbody');
  if (!tbody || !currentUser) return;

  const tenantBills = bills.filter(item => item.tenantId === currentUser.id);
  
  if (tenantBills.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No bills found for this tenant.</td></tr>';
    return;
  }
  
  tbody.innerHTML = tenantBills
    .map(item => `
      <tr>
        <td>${item.month}</td>
        <td>${formatCurrency(item.rent)}</td>
        <td>${formatCurrency(item.utilities)}</td>
        <td>${formatCurrency(item.other)}</td>
        <td>${formatCurrency(item.total)}</td>
        <td><span class="status-badge ${statusClass(item.status)}">${formatStatus(item.status)}</span></td>
        <td>${item.status === 'paid' ? '<span>Paid</span>' : `<button class="btn-small" onclick="openBillPaymentForm('${item.id}')">${item.status === 'pending' ? 'Update Proof' : 'Pay Now'}</button>`}</td>
      </tr>
    `)
    .join('');

  const outstanding = tenantBills.filter(item => item.status !== 'paid').reduce((sum, item) => sum + item.total, 0);
  setText('outstanding-amount', formatCurrency(outstanding));
  setText('dashboard-outstanding', formatCurrency(outstanding));

  const nextDue = tenantBills.find(item => item.status !== 'paid');
  const dueElement = document.querySelector('.alert-card p strong');
  if (dueElement) dueElement.textContent = nextDue ? formatDisplayDate(nextDue.dueDate) : 'No pending due dates';
}

function openTenantSection(section) {
  document.querySelectorAll('.portal-section').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  const activeSection = document.getElementById(section);
  const activeLink = document.querySelector(`.nav-item[data-section="${section}"]`);

  if (activeSection) activeSection.classList.add('active');
  if (activeLink) activeLink.classList.add('active');
}

function openSection(section) {
  openTenantSection(section);
}

function openRequestForm() {
  const modal = document.getElementById('form-modal');
  const content = document.getElementById('form-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <h3>Create Maintenance Request</h3>
    <form class="auth-form" onsubmit="submitMaintenanceRequest(event)">
      <label for="request-type">Type of Issue</label>
      <select id="request-type" required>
        <option value="">Select one</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Electrical">Electrical</option>
        <option value="HVAC">HVAC</option>
        <option value="Appliances">Appliances</option>
        <option value="Other">Other</option>
      </select>
      <label for="request-description">Description</label>
      <textarea id="request-description" placeholder="Describe the issue..." rows="4" required></textarea>
      <label for="request-contact">Preferred Contact Method</label>
      <select id="request-contact" required>
        <option value="Email">Email</option>
        <option value="Phone">Phone</option>
        <option value="SMS">SMS</option>
      </select>
      <button type="submit" class="btn">Submit Request</button>
    </form>
  `;

  modal.classList.add('active');
}

function openReportForm() {
  const modal = document.getElementById('form-modal');
  const content = document.getElementById('form-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <h3>Report an Issue</h3>
    <form class="auth-form" onsubmit="submitIssueReport(event)">
      <label for="report-type">Issue Type</label>
      <select id="report-type" required>
        <option value="">Select one</option>
        <option value="Noise Complaint">Noise Complaint</option>
        <option value="Safety Concern">Safety Concern</option>
        <option value="Cleanliness Issue">Cleanliness Issue</option>
        <option value="Other">Other</option>
      </select>
      <label for="report-description">Description</label>
      <textarea id="report-description" placeholder="Describe the issue..." rows="4" required></textarea>
      <label for="report-severity">Severity</label>
      <select id="report-severity" required>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button type="submit" class="btn">Submit Report</button>
    </form>
  `;

  modal.classList.add('active');
}

function submitMaintenanceRequest(event) {
  event.preventDefault();

  const tenant = tenants.find(item => item.id === currentUser.id);
  const request = {
    id: `REQ-${Date.now()}`,
    tenantId: currentUser.id,
    tenantName: currentUser.name,
    unit: tenant ? tenant.unit : currentUser.unit,
    title: getInputValue('request-type'),
    description: getInputValue('request-description'),
    contactMethod: getInputValue('request-contact'),
    status: 'pending',
    submittedDate: todayIso(),
    notes: 'Request received and pending review.'
  };

  maintenanceRequests.unshift(request);
  saveArray(STORAGE_KEYS.maintenanceRequests, maintenanceRequests);
  refreshState();
  closeFormModal();
  loadTenantRequests();
  alert('Maintenance request submitted successfully.');
}

function submitIssueReport(event) {
  event.preventDefault();

  const tenant = tenants.find(item => item.id === currentUser.id);
  const report = {
    id: `REP-${Date.now()}`,
    tenantId: currentUser.id,
    tenantName: currentUser.name,
    unit: tenant ? tenant.unit : currentUser.unit,
    title: getInputValue('report-type'),
    description: getInputValue('report-description'),
    severity: getInputValue('report-severity'),
    status: 'pending',
    submittedDate: todayIso(),
    notes: 'Report received and pending review.'
  };

  tenantReports.unshift(report);
  saveArray(STORAGE_KEYS.tenantReports, tenantReports);
  refreshState();
  closeFormModal();
  loadTenantReports();
  alert('Issue report submitted successfully.');
}

function closeFormModal() {
  const modal = document.getElementById('form-modal');
  if (modal) modal.classList.remove('active');
}

function openBillPaymentForm(id) {
  const bill = bills.find(item => item.id === id);
  if (!bill) return;

  const modal = document.getElementById('form-modal');
  const content = document.getElementById('form-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <h3>Manual Payment Instructions</h3>
    <div class="payment-instructions">
      <p><strong>Bill:</strong> ${bill.month}</p>
      <p><strong>Amount:</strong> ${formatCurrency(bill.total)}</p>
      <p><strong>Send GCash to:</strong> ${PAYMENT_SETTINGS.gcashNumber} - ${PAYMENT_SETTINGS.gcashName}</p>
      <p>After sending payment, submit your reference number and upload a screenshot for admin review.</p>
    </div>
    <form class="auth-form" onsubmit="submitBillPaymentProof(event, '${id}')">
      <label for="bill-proof-reference">Reference Number</label>
      <input type="text" id="bill-proof-reference" value="${bill.proofReference || ''}" placeholder="Example: GCash reference number" required>
      <label for="bill-proof-file">Proof Screenshot</label>
      <input type="file" id="bill-proof-file" accept="image/*" ${bill.proofDataUrl ? '' : 'required'}>
      <button type="submit" class="btn">Submit Proof</button>
    </form>
  `;

  modal.classList.add('active');
}

function submitBillPaymentProof(event, id) {
  event.preventDefault();

  const bill = bills.find(item => item.id === id);
  if (!bill) return;

  const proofInput = document.getElementById('bill-proof-file');
  const proofFile = proofInput && proofInput.files.length ? proofInput.files[0] : null;

  if (proofFile) {
    const reader = new FileReader();
    reader.onload = () => finalizeBillPaymentProof(bill, proofFile.name, reader.result);
    reader.readAsDataURL(proofFile);
    return;
  }

  finalizeBillPaymentProof(bill, bill.proofFileName || 'Existing proof', bill.proofDataUrl || '');
}

function finalizeBillPaymentProof(bill, proofFileName, proofDataUrl) {
  bill.status = 'pending';
  bill.proofReference = getInputValue('bill-proof-reference');
  bill.proofFileName = proofFileName;
  bill.proofDataUrl = proofDataUrl;
  bill.proofSubmittedAt = new Date().toISOString();
  bill.paymentInstructions = createPaymentInstructions(bill.id, bill.total);

  const tenant = tenants.find(item => item.id === bill.tenantId);
  upsertPaymentSubmission({
    id: `PAY-${bill.id}`,
    type: 'bill',
    billId: bill.id,
    tenantId: bill.tenantId,
    tenantName: tenant ? tenant.name : currentUser.name,
    unit: tenant ? tenant.unit : currentUser.unit || '',
    label: bill.month,
    amount: bill.total,
    proofReference: bill.proofReference,
    proofFileName: bill.proofFileName,
    proofDataUrl: bill.proofDataUrl,
    status: 'pending',
    submittedAt: bill.proofSubmittedAt
  });

  saveArray(STORAGE_KEYS.bills, bills);
  saveArray(STORAGE_KEYS.paymentSubmissions, paymentSubmissions);
  refreshState();
  closeFormModal();
  loadTenantBills();
  alert('Proof of payment submitted. Status is now pending admin verification.');
}

function downloadDocument(doc) {
  const labels = {
    lease: 'Lease Agreement',
    rules: 'House Rules',
    emergency: 'Emergency Procedures',
    facilities: 'Facility Usage Guide'
  };

  alert(`${labels[doc] || 'Document'} download started.`);
}

function initializeAdminPortal() {
  if (!document.body.classList.contains('admin-body')) return;

  if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'index.html';
    return;
  }

  setText('admin-name', currentUser.name);
  loadAdminStats();
  loadAdminAnnouncements();
  loadAdminTenants();
  loadAdminUnits();
  loadAdminRequests();
  loadAdminReports();
  loadAdminBills();
}

function loadAdminStats() {
  loadAdminOverview();

  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length < 4) return;

  const totalUnits = units.length;
  const occupiedUnits = units.filter(item => item.status === 'occupied').length;
  const activeTenants = tenants.filter(item => item.status === 'active').length;
  const activeWork = maintenanceRequests.filter(item => item.status !== 'completed').length + tenantReports.filter(item => item.status !== 'resolved').length;
  const expectedRevenue = bills.reduce((sum, item) => sum + item.total, 0);

  statCards[0].querySelector('.big-number').textContent = totalUnits;
  statCards[0].querySelector('.stat-label').textContent = `${occupiedUnits} occupied, ${totalUnits - occupiedUnits} available`;
  statCards[1].querySelector('.big-number').textContent = activeTenants;
  statCards[1].querySelector('.stat-label').textContent = activeTenants ? 'Tenant roster is up to date' : 'No active tenants';
  statCards[2].querySelector('.big-number').textContent = activeWork;
  statCards[2].querySelector('.stat-label').textContent = `${maintenanceRequests.filter(item => item.status !== 'completed').length} requests, ${tenantReports.filter(item => item.status !== 'resolved').length} reports`;
  statCards[3].querySelector('.big-number').textContent = formatCurrency(expectedRevenue);
  statCards[3].querySelector('.stat-label').textContent = 'Expected across all active bills';
}

function loadAdminOverview() {
  const totalUnits = units.length;
  const occupiedUnits = units.filter(item => item.status === 'occupied').length;
  const activeTenants = tenants.filter(item => item.status === 'active').length;
  const openRequests = maintenanceRequests.filter(item => item.status !== 'completed').length;
  const openReports = tenantReports.filter(item => item.status !== 'resolved').length;
  const outstandingBills = bills.filter(item => item.status !== 'paid').reduce((sum, item) => sum + item.total, 0);
  const outstandingBookings = bookings
    .filter(item => item.status !== 'paid' && item.status !== 'expired')
    .reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
  const outstanding = outstandingBills + outstandingBookings;

  setText('admin-occupied-units', `${occupiedUnits}/${totalUnits}`);
  setText('admin-occupancy-note', totalUnits ? `${Math.round((occupiedUnits / totalUnits) * 100)}% occupied` : 'No units on file');
  setText('admin-active-tenants', activeTenants);
  setText('admin-open-work', openRequests + openReports);
  setText('admin-outstanding-balance', formatCurrency(outstanding));
}

function loadAdminAnnouncements() {
  const list = document.querySelector('.announcements-admin');
  if (!list) return;

  list.innerHTML = announcements
    .map(item => `
      <div class="announcement-admin-card">
        <div class="announcement-header">
          <h3>${item.title}</h3>
          <span class="date">${formatDisplayDate(item.date)}</span>
        </div>
        <p>${item.content}</p>
        <div class="announcement-actions">
          <button class="btn-small" onclick="editAnnouncement('${item.id}')">Edit</button>
          <button class="btn-small danger" onclick="deleteAnnouncement('${item.id}')">Delete</button>
        </div>
      </div>
    `)
    .join('');
}

function loadAdminTenants() {
  const tbody = document.querySelector('#tenants table tbody');
  if (!tbody) return;

  tbody.innerHTML = tenants
    .map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.unit}</td>
        <td>${item.email}</td>
        <td>${item.phone}</td>
        <td>${formatDisplayDate(item.leaseStart)}</td>
        <td>${formatDisplayDate(item.leaseEnd)}</td>
        <td><span class="status-badge ${statusClass(item.status)}">${item.status}</span></td>
        <td>
          <button class="btn-small" onclick="editTenant('${item.id}')">Edit</button>
          <button class="btn-small danger" onclick="removeTenant('${item.id}')">Remove</button>
        </td>
      </tr>
    `)
    .join('');
}

function loadAdminUnits() {
  const tbody = document.querySelector('#units table tbody');
  if (!tbody) return;

  tbody.innerHTML = units
    .map(unit => {
      const tenant = tenants.find(item => item.id === unit.tenantId);
      return `
        <tr>
          <td>${unit.number}</td>
          <td>${unit.type}</td>
          <td>${unit.floor}</td>
          <td>${unit.size}</td>
          <td>${tenant ? tenant.name : 'Unassigned'}</td>
          <td>${formatCurrency(Number(unit.rent))}</td>
          <td><span class="status-badge ${statusClass(unit.status)}">${unit.status}</span></td>
          <td>
            <button class="btn-small" onclick="editUnit('${unit.id}')">Edit</button>
            <button class="btn-small ${unit.tenantId ? 'danger' : ''}" onclick="assignTenant('${unit.id}')">${unit.tenantId ? 'Manage' : 'Assign'}</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

function loadAdminRequests() {
  const list = document.querySelector('.requests-admin');
  if (!list) return;

  const filteredRequests = maintenanceRequests.filter(item => requestFilter === 'all' || item.status === requestFilter);
  list.innerHTML = filteredRequests.length
    ? filteredRequests
        .map(item => `
          <div class="request-admin-card">
            <div class="request-header">
              <h3>${item.id}: ${item.title}</h3>
              <span class="status-badge ${statusClass(item.status)}">${item.status.replace('-', ' ')}</span>
            </div>
            <p><strong>Tenant:</strong> ${item.tenantName} (${item.unit})</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Preferred Contact:</strong> ${item.contactMethod || 'Not provided'}</p>
            <p><strong>Submitted:</strong> ${formatDisplayDate(item.submittedDate)}</p>
            <p><strong>Notes:</strong> ${item.notes || 'No notes'}</p>
            <div class="request-actions">
              <button class="btn-small" onclick="updateRequestStatus('${item.id}', 'pending')">Pending</button>
              <button class="btn-small" onclick="updateRequestStatus('${item.id}', 'in-progress')">Start</button>
              <button class="btn-small" onclick="updateRequestStatus('${item.id}', 'completed')">Complete</button>
            </div>
          </div>
        `)
        .join('')
    : '<div class="request-admin-card"><p>No requests match the selected filter.</p></div>';
}

function loadAdminReports() {
  const list = document.querySelector('.reports-admin');
  if (!list) return;

  list.innerHTML = tenantReports.length
    ? tenantReports
        .map(item => `
          <div class="report-admin-card">
            <div class="report-header">
              <h3>${item.id}: ${item.title}</h3>
              <span class="status-badge ${statusClass(item.status)}">${item.status.replace('-', ' ')}</span>
            </div>
            <p><strong>Reporter:</strong> ${item.tenantName} (${item.unit})</p>
            <p><strong>Severity:</strong> ${item.severity || 'Not set'}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Submitted:</strong> ${formatDisplayDate(item.submittedDate)}</p>
            <p><strong>Notes:</strong> ${item.notes || 'No notes'}</p>
            <div class="report-actions">
              <button class="btn-small" onclick="updateReportStatus('${item.id}', 'in-review')">In Review</button>
              <button class="btn-small" onclick="resolveReport('${item.id}')">Resolve</button>
            </div>
          </div>
        `)
        .join('')
    : '<div class="report-admin-card"><p>No tenant reports are currently on file.</p></div>';
}

function loadAdminBills() {
  const tbody = document.querySelector('#billing table tbody');
  const billingCards = document.querySelectorAll('.billing-card .big-number');
  const billPaymentList = document.getElementById('bill-payment-reviews');
  const bookingList = document.getElementById('booking-payment-reviews');
  if (!tbody) return;

  tbody.innerHTML = bills
    .map(item => {
      const tenant = tenants.find(user => user.id === item.tenantId);
      return tenant
        ? `
          <tr>
            <td>${tenant.name}</td>
            <td>${tenant.unit}</td>
            <td>${item.month}</td>
            <td>${formatCurrency(item.total)}</td>
            <td>${formatDisplayDate(item.dueDate)}</td>
            <td><span class="status-badge ${statusClass(item.status)}">${formatStatus(item.status)}</span></td>
            <td>${renderBillAdminActions(item)}</td>
          </tr>
        `
        : '';
    })
    .join('');

  if (billPaymentList) {
    const billPayments = paymentSubmissions.filter(item => item.type === 'bill');
    billPaymentList.innerHTML = billPayments.length
      ? billPayments.map(item => `
          <div class="payment-review-card">
            <div>
              <h3>${item.id} - ${item.label}</h3>
              <p>${item.tenantName || 'Tenant'} ${item.unit ? `(${item.unit})` : ''}</p>
              <p>Amount: ${formatCurrency(item.amount)} | Submitted: ${formatDisplayDate(item.submittedAt)}</p>
              <p>Reference: ${item.proofReference || 'No reference'} | File: ${item.proofFileName || 'No file'}</p>
            </div>
            <div class="payment-review-actions">
              <span class="status-badge ${statusClass(item.status)}">${formatStatus(item.status)}</span>
              ${item.status === 'pending' ? `<button class="btn-small" onclick="openBillPaymentReview('${item.id}')">Verify Payment</button>` : ''}
            </div>
          </div>
        `).join('')
      : '<div class="payment-review-card"><p>No bill payment proofs have been submitted yet.</p></div>';
  }

  if (bookingList) {
    const reviewableBookings = bookings.filter(item => ['pending', 'payment-submitted', 'paid', 'expired'].includes(item.status));
    bookingList.innerHTML = reviewableBookings.length
      ? reviewableBookings.map(item => `
          <div class="payment-review-card">
            <div>
              <h3>${item.id} - ${formatUnitType(item.unitType)}</h3>
              <p>${item.name} (${item.email})</p>
              <p>Amount: ${formatCurrency(item.totalAmount)} | Check-in: ${formatDisplayDate(item.checkIn)}</p>
              <p>Expires: ${formatDisplayDate(item.expiresAt)} | Proof: ${item.proofReference || 'Not submitted'}</p>
            </div>
            <div class="payment-review-actions">
              <span class="status-badge ${statusClass(item.status)}">${formatStatus(item.status)}</span>
              ${item.status === 'payment-submitted' ? `<button class="btn-small" onclick="confirmBookingPayment('${item.id}')">Confirm Payment</button>` : ''}
              ${item.status !== 'paid' && item.status !== 'expired' ? `<button class="btn-small danger" onclick="expireBooking('${item.id}')">Expire</button>` : ''}
            </div>
          </div>
        `).join('')
      : '<div class="payment-review-card"><p>No booking payments are waiting for review.</p></div>';
  }

  if (billingCards.length === 3) {
    const bookingExpected = bookings.filter(item => item.status !== 'expired').reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
    const bookingReceived = bookings.filter(item => item.status === 'paid').reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
    const expected = bills.reduce((sum, item) => sum + item.total, 0) + bookingExpected;
    const received = bills.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.total, 0) + bookingReceived;
    const outstanding = expected - received;

    billingCards[0].textContent = formatCurrency(expected);
    billingCards[1].textContent = formatCurrency(received);
    billingCards[2].textContent = formatCurrency(outstanding);
  }
}

function openCreateAnnouncementForm() {
  const modal = document.getElementById('form-modal') || createModal();
  const content = document.getElementById('form-content');
  if (!content) return;

  content.innerHTML = `
    <h3>Create New Announcement</h3>
    <form class="auth-form" onsubmit="createAnnouncement(event)">
      <input type="text" id="ann-title" placeholder="Title" required>
      <textarea id="ann-content" placeholder="Content" rows="4" required></textarea>
      <button type="submit" class="btn">Create Announcement</button>
    </form>
  `;

  modal.classList.add('active');
}

function createAnnouncement(event) {
  event.preventDefault();

  announcements.unshift({
    id: `ANN-${Date.now()}`,
    title: getInputValue('ann-title'),
    content: getInputValue('ann-content'),
    date: todayIso(),
    published: true
  });

  saveArray(STORAGE_KEYS.announcements, announcements);
  refreshState();
  closeFormModal();
  loadAdminAnnouncements();
  alert('Announcement created successfully.');
}

function editAnnouncement(id) {
  const announcement = announcements.find(item => item.id === id);
  const modal = document.getElementById('form-modal') || createModal();
  const content = document.getElementById('form-content');

  if (!announcement || !content) return;

  content.innerHTML = `
    <h3>Edit Announcement</h3>
    <form class="auth-form" onsubmit="updateAnnouncement(event, '${id}')">
      <input type="text" id="ann-title" value="${announcement.title}" required>
      <textarea id="ann-content" rows="4" required>${announcement.content}</textarea>
      <button type="submit" class="btn">Update Announcement</button>
    </form>
  `;

  modal.classList.add('active');
}

function updateAnnouncement(event, id) {
  event.preventDefault();

  const announcement = announcements.find(item => item.id === id);
  if (!announcement) return;

  announcement.title = getInputValue('ann-title');
  announcement.content = getInputValue('ann-content');
  saveArray(STORAGE_KEYS.announcements, announcements);
  refreshState();
  closeFormModal();
  loadAdminAnnouncements();
  alert('Announcement updated successfully.');
}

function deleteAnnouncement(id) {
  if (!confirm('Delete this announcement?')) return;

  announcements = announcements.filter(item => item.id !== id);
  saveArray(STORAGE_KEYS.announcements, announcements);
  refreshState();
  loadAdminAnnouncements();
}

function createModal() {
  const modal = document.createElement('div');
  modal.id = 'form-modal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="closeFormModal()">&times;</span>
      <div id="form-content"></div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function openAdminSection(section) {
  document.querySelectorAll('.admin-section').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(item => item.classList.remove('active'));

  const activeSection = document.getElementById(section);
  const activeLink = document.querySelector(`.admin-nav-item[data-section="${section}"]`);

  if (activeSection) activeSection.classList.add('active');
  if (activeLink) activeLink.classList.add('active');
}

function filterRequests(type) {
  requestFilter = type;

  document.querySelectorAll('#requests .filter-btn').forEach(button => {
    const isActive = button.textContent.trim().toLowerCase().replace(' ', '-') === type || (button.textContent.trim() === 'All' && type === 'all');
    button.classList.toggle('active', isActive);
  });

  loadAdminRequests();
}

function openAddTenantForm() {
  const modal = document.getElementById('form-modal') || createModal();
  const content = document.getElementById('form-content');
  if (!content) return;

  const availableUnits = units.filter(item => !item.tenantId);
  const options = availableUnits.map(item => `<option value="${item.id}">${item.number}</option>`).join('');

  content.innerHTML = `
    <h3>Add New Tenant</h3>
    <form class="auth-form" onsubmit="submitAddTenant(event)">
      <input type="text" id="tenant-name" placeholder="Full Name" required>
      <input type="email" id="tenant-email" placeholder="Email" required>
      <input type="tel" id="tenant-phone" placeholder="Phone" required>
      <label for="tenant-unit">Assign to Unit</label>
      <select id="tenant-unit" required>
        <option value="">Select Unit</option>
        ${options}
      </select>
      <input type="date" id="tenant-lease-start" required>
      <input type="date" id="tenant-lease-end" required>
      <button type="submit" class="btn">Add Tenant</button>
    </form>
  `;

  modal.classList.add('active');
}

function submitAddTenant(event) {
  event.preventDefault();

  const unit = units.find(item => item.id === getInputValue('tenant-unit'));
  if (!unit) {
    alert('Please choose an available unit.');
    return;
  }

  const tenantId = `T${Date.now().toString().slice(-6)}`;
  tenants.push({
    id: tenantId,
    name: getInputValue('tenant-name'),
    unit: unit.number,
    email: getInputValue('tenant-email'),
    phone: getInputValue('tenant-phone'),
    leaseStart: getInputValue('tenant-lease-start'),
    leaseEnd: getInputValue('tenant-lease-end'),
    status: 'active'
  });

  unit.tenantId = tenantId;
  unit.status = 'occupied';

  saveArray(STORAGE_KEYS.tenants, tenants);
  saveArray(STORAGE_KEYS.units, units);
  refreshState();
  closeFormModal();
  loadAdminTenants();
  loadAdminUnits();
  loadAdminStats();
  alert('Tenant added successfully.');
}

function editTenant(id) {
  const tenant = tenants.find(item => item.id === id);
  const modal = document.getElementById('form-modal') || createModal();
  const content = document.getElementById('form-content');

  if (!tenant || !content) return;

  content.innerHTML = `
    <h3>Edit Tenant</h3>
    <form class="auth-form" onsubmit="updateTenant(event, '${id}')">
      <input type="text" id="tenant-name" value="${tenant.name}" required>
      <input type="email" id="tenant-email" value="${tenant.email}" required>
      <input type="tel" id="tenant-phone" value="${tenant.phone}" required>
      <input type="date" id="tenant-lease-start" value="${toInputDate(tenant.leaseStart)}" required>
      <input type="date" id="tenant-lease-end" value="${toInputDate(tenant.leaseEnd)}" required>
      <select id="tenant-status" required>
        <option value="active" ${tenant.status === 'active' ? 'selected' : ''}>Active</option>
        <option value="inactive" ${tenant.status === 'inactive' ? 'selected' : ''}>Inactive</option>
      </select>
      <button type="submit" class="btn">Update Tenant</button>
    </form>
  `;

  modal.classList.add('active');
}

function updateTenant(event, id) {
  event.preventDefault();

  const tenant = tenants.find(item => item.id === id);
  if (!tenant) return;

  tenant.name = getInputValue('tenant-name');
  tenant.email = getInputValue('tenant-email');
  tenant.phone = getInputValue('tenant-phone');
  tenant.leaseStart = getInputValue('tenant-lease-start');
  tenant.leaseEnd = getInputValue('tenant-lease-end');
  tenant.status = getInputValue('tenant-status');

  saveArray(STORAGE_KEYS.tenants, tenants);
  refreshState();
  closeFormModal();
  loadAdminTenants();
  if (currentUser && currentUser.id === id) initializeTenantPortal();
  alert('Tenant updated successfully.');
}

function removeTenant(id) {
  if (!confirm('Remove this tenant?')) return;

  const unit = units.find(item => item.tenantId === id);
  if (unit) {
    unit.tenantId = null;
    unit.status = 'available';
  }

  bills = bills.filter(item => item.tenantId !== id);
  tenants = tenants.filter(item => item.id !== id);

  saveArray(STORAGE_KEYS.units, units);
  saveArray(STORAGE_KEYS.bills, bills);
  saveArray(STORAGE_KEYS.tenants, tenants);
  refreshState();
  loadAdminTenants();
  loadAdminUnits();
  loadAdminBills();
  loadAdminStats();
}

function openAddUnitForm() {
  const modal = document.getElementById('form-modal') || createModal();
  const content = document.getElementById('form-content');
  if (!content) return;

  content.innerHTML = `
    <h3>Add New Unit</h3>
    <form class="auth-form" onsubmit="submitAddUnit(event)">
      <input type="text" id="unit-number" placeholder="Unit Number (e.g. Unit 401)" required>
      <select id="unit-type" required>
        <option value="">Select Type</option>
        <option value="Studio">Studio</option>
        <option value="1 Bedroom">1 Bedroom</option>
        <option value="2 Bedroom">2 Bedroom</option>
        <option value="3 Bedroom">3 Bedroom</option>
      </select>
      <input type="text" id="unit-floor" placeholder="Floor (e.g. 4th Floor)" required>
      <input type="text" id="unit-size" placeholder="Size (e.g. 700 sq ft)" required>
      <input type="number" id="unit-rent" placeholder="Monthly Rent" min="0" required>
      <button type="submit" class="btn">Add Unit</button>
    </form>
  `;

  modal.classList.add('active');
}

function submitAddUnit(event) {
  event.preventDefault();

  units.push({
    id: `U${Date.now().toString().slice(-6)}`,
    number: getInputValue('unit-number'),
    type: getInputValue('unit-type'),
    floor: getInputValue('unit-floor'),
    size: getInputValue('unit-size'),
    rent: Number(getInputValue('unit-rent')),
    tenantId: null,
    status: 'available'
  });

  saveArray(STORAGE_KEYS.units, units);
  refreshState();
  closeFormModal();
  loadAdminUnits();
  loadAdminStats();
  alert('Unit added successfully.');
}

function editUnit(id) {
  const unit = units.find(item => item.id === id);
  const modal = document.getElementById('form-modal') || createModal();
  const content = document.getElementById('form-content');

  if (!unit || !content) return;

  content.innerHTML = `
    <h3>Edit Unit</h3>
    <form class="auth-form" onsubmit="updateUnit(event, '${id}')">
      <input type="text" id="unit-number" value="${unit.number}" required>
      <select id="unit-type" required>
        <option value="Studio" ${unit.type === 'Studio' ? 'selected' : ''}>Studio</option>
        <option value="1 Bedroom" ${unit.type === '1 Bedroom' ? 'selected' : ''}>1 Bedroom</option>
        <option value="2 Bedroom" ${unit.type === '2 Bedroom' ? 'selected' : ''}>2 Bedroom</option>
        <option value="3 Bedroom" ${unit.type === '3 Bedroom' ? 'selected' : ''}>3 Bedroom</option>
      </select>
      <input type="text" id="unit-floor" value="${unit.floor}" required>
      <input type="text" id="unit-size" value="${unit.size}" required>
      <input type="number" id="unit-rent" value="${unit.rent}" min="0" required>
      <button type="submit" class="btn">Update Unit</button>
    </form>
  `;

  modal.classList.add('active');
}

function updateUnit(event, id) {
  event.preventDefault();

  const unit = units.find(item => item.id === id);
  if (!unit) return;

  unit.number = getInputValue('unit-number');
  unit.type = getInputValue('unit-type');
  unit.floor = getInputValue('unit-floor');
  unit.size = getInputValue('unit-size');
  unit.rent = Number(getInputValue('unit-rent'));

  const tenant = tenants.find(item => item.id === unit.tenantId);
  if (tenant) tenant.unit = unit.number;

  saveArray(STORAGE_KEYS.units, units);
  saveArray(STORAGE_KEYS.tenants, tenants);
  refreshState();
  closeFormModal();
  loadAdminUnits();
  loadAdminTenants();
  alert('Unit updated successfully.');
}

function assignTenant(id) {
  const unit = units.find(item => item.id === id);
  const modal = document.getElementById('form-modal') || createModal();
  const content = document.getElementById('form-content');

  if (!unit || !content) return;

  const unassignedTenants = tenants.filter(item => !units.some(unitItem => unitItem.tenantId === item.id));
  const options = unassignedTenants.map(item => `<option value="${item.id}">${item.name}</option>`).join('');

  if (unit.tenantId) {
    const tenant = tenants.find(item => item.id === unit.tenantId);
    content.innerHTML = `
      <h3>Manage Unit Assignment</h3>
      <p><strong>Unit:</strong> ${unit.number}</p>
      <p><strong>Current Tenant:</strong> ${tenant ? tenant.name : 'Unknown'}</p>
      <button class="btn btn-small danger" onclick="unassignUnitTenant('${id}')">Remove Tenant</button>
    `;
  } else {
    content.innerHTML = `
      <h3>Assign Tenant to ${unit.number}</h3>
      <form class="auth-form" onsubmit="submitAssignTenant(event, '${id}')">
        <select id="assign-tenant" required>
          <option value="">Select Tenant</option>
          ${options}
        </select>
        <button type="submit" class="btn">Assign Tenant</button>
      </form>
    `;
  }

  modal.classList.add('active');
}

function submitAssignTenant(event, unitId) {
  event.preventDefault();

  const tenantId = getInputValue('assign-tenant');
  const unit = units.find(item => item.id === unitId);
  const tenant = tenants.find(item => item.id === tenantId);

  if (!tenantId || !unit || !tenant) {
    alert('Please select a tenant.');
    return;
  }

  units.forEach(item => {
    if (item.tenantId === tenantId) {
      item.tenantId = null;
      item.status = 'available';
    }
  });

  unit.tenantId = tenantId;
  unit.status = 'occupied';
  tenant.unit = unit.number;

  saveArray(STORAGE_KEYS.units, units);
  saveArray(STORAGE_KEYS.tenants, tenants);
  refreshState();
  closeFormModal();
  loadAdminUnits();
  loadAdminTenants();
  loadAdminStats();
  alert('Tenant assigned successfully.');
}

function unassignUnitTenant(unitId) {
  if (!confirm('Remove the tenant from this unit?')) return;

  const unit = units.find(item => item.id === unitId);
  if (!unit) return;

  const tenant = tenants.find(item => item.id === unit.tenantId);
  if (tenant) tenant.unit = 'Unassigned';

  unit.tenantId = null;
  unit.status = 'available';

  saveArray(STORAGE_KEYS.units, units);
  saveArray(STORAGE_KEYS.tenants, tenants);
  refreshState();
  closeFormModal();
  loadAdminUnits();
  loadAdminTenants();
  loadAdminStats();
}

function updateRequestStatus(id, status) {
  const request = maintenanceRequests.find(item => item.id === id);
  if (!request) return;

  request.status = status;
  request.notes =
    status === 'completed'
      ? 'Work order completed.'
      : status === 'in-progress'
        ? 'Maintenance team is actively handling this request.'
        : 'Request is queued for review.';

  saveArray(STORAGE_KEYS.maintenanceRequests, maintenanceRequests);
  refreshState();
  loadAdminRequests();
  loadAdminStats();
}

function updateReportStatus(id, status) {
  const report = tenantReports.find(item => item.id === id);
  if (!report) return;

  report.status = status;
  report.notes = status === 'in-review' ? 'Admin is currently reviewing this report.' : report.notes;

  saveArray(STORAGE_KEYS.tenantReports, tenantReports);
  refreshState();
  loadAdminReports();
  loadAdminStats();
}

function resolveReport(id) {
  const report = tenantReports.find(item => item.id === id);
  if (!report) return;

  report.status = 'resolved';
  report.notes = 'Issue has been resolved by management.';
  saveArray(STORAGE_KEYS.tenantReports, tenantReports);
  refreshState();
  loadAdminReports();
  loadAdminStats();
}

function openBillPaymentReview(paymentId) {
  const submission = paymentSubmissions.find(item => item.id === paymentId);
  if (!submission) {
    alert('No payment proof was found for this bill yet.');
    return;
  }

  const bill = bills.find(item => item.id === submission.billId);
  const modal = document.getElementById('form-modal') || createModal();
  const content = document.getElementById('form-content');
  if (!content) return;

  const proofPreview = submission.proofDataUrl && submission.proofDataUrl.startsWith('data:image/')
    ? `<img class="payment-proof-preview" src="${submission.proofDataUrl}" alt="Payment proof for ${submission.id}">`
    : `<div class="payment-proof-placeholder">No image preview available. File: ${submission.proofFileName || 'No file uploaded'}</div>`;

  content.innerHTML = `
    <h3>Verify Bill Payment</h3>
    <div class="payment-review-detail">
      <p><strong>Tenant:</strong> ${submission.tenantName || 'Tenant'}</p>
      <p><strong>Unit:</strong> ${submission.unit || 'Not assigned'}</p>
      <p><strong>Bill:</strong> ${submission.label || (bill ? bill.month : submission.billId)}</p>
      <p><strong>Amount:</strong> ${formatCurrency(submission.amount || (bill ? bill.total : 0))}</p>
      <p><strong>Reference Number:</strong> ${submission.proofReference || 'No reference number'}</p>
      <p><strong>Uploaded File:</strong> ${submission.proofFileName || 'No file uploaded'}</p>
      <p><strong>Status:</strong> <span class="status-badge ${statusClass(submission.status)}">${formatStatus(submission.status)}</span></p>
      ${proofPreview}
    </div>
    <div class="payment-review-modal-actions">
      <button class="btn" onclick="markBillPaid('${submission.billId}')">Confirm as Paid</button>
      <button class="btn-small danger" onclick="closeFormModal()">Close</button>
    </div>
  `;

  modal.classList.add('active');
}

function markBillPaid(id) {
  const bill = bills.find(item => item.id === id);
  if (!bill) return;

  bill.status = 'paid';
  bill.verifiedAt = new Date().toISOString();

  paymentSubmissions = paymentSubmissions.map(item => {
    if (item.type !== 'bill' || item.billId !== id) return item;

    return {
      ...item,
      status: 'paid',
      verifiedAt: bill.verifiedAt
    };
  });

  saveArray(STORAGE_KEYS.bills, bills);
  saveArray(STORAGE_KEYS.paymentSubmissions, paymentSubmissions);
  refreshState();
  closeFormModal();
  loadAdminBills();
  loadAdminStats();
  alert('Payment verified. The bill is now marked as paid.');
}

function upsertPaymentSubmission(submission) {
  const index = paymentSubmissions.findIndex(item => item.id === submission.id);

  if (index >= 0) {
    paymentSubmissions[index] = {
      ...paymentSubmissions[index],
      ...submission
    };
    return;
  }

  paymentSubmissions.unshift(submission);
}

function renderBillAdminActions(item) {
  if (item.status === 'paid') return '<span>Paid</span>';

  if (item.status === 'pending') {
    return `
      <div class="table-action-stack">
        <span>Ref: ${item.proofReference || 'No reference'}</span>
        <span>File: ${item.proofFileName || 'No file'}</span>
        <button class="btn-small" onclick="openBillPaymentReview('PAY-${item.id}')">Verify Payment</button>
      </div>
    `;
  }

  return '<span>Waiting for proof</span>';
}

function confirmBookingPayment(id) {
  const booking = bookings.find(item => item.id === id);
  if (!booking) return;

  booking.status = 'paid';
  booking.verifiedAt = new Date().toISOString();

  if (booking.holdUnitId) {
    const unit = units.find(item => item.id === booking.holdUnitId);
    if (unit) unit.status = 'confirmed';
  }

  saveArray(STORAGE_KEYS.bookings, bookings);
  saveArray(STORAGE_KEYS.units, units);
  refreshState();
  loadAdminBills();
  loadAdminUnits();
  loadAdminStats();
  alert(`${booking.id} has been confirmed as paid.`);
}

function expireBooking(id) {
  const booking = bookings.find(item => item.id === id);
  if (!booking) return;

  booking.status = 'expired';
  booking.expiredAt = new Date().toISOString();
  if (booking.holdUnitId) releaseHeldUnit(booking.holdUnitId);

  saveArray(STORAGE_KEYS.bookings, bookings);
  saveArray(STORAGE_KEYS.units, units);
  refreshState();
  loadAdminBills();
  loadAdminUnits();
  loadAdminStats();
}

function submitBooking(event) {
  event.preventDefault();

  if (!currentUser || currentUser.role !== 'inquiry') {
    localStorage.setItem(STORAGE_KEYS.selectedBookingUnit, getInputValue('unit-type') || 'studio');
    alert('Please log in or register for an inquiry account before booking.');
    openAuthModal('inquiry');
    return;
  }

  const unitType = getInputValue('unit-type');
  const checkIn = getInputValue('check-in');
  const duration = getInputValue('duration');
  const name = getInputValue('name');
  const email = getInputValue('email');
  const phone = getInputValue('phone');

  if (!unitType || !checkIn || !duration || !name || !email || !phone) {
    alert('Please complete the booking form.');
    return;
  }

  const totalAmount = calculateBookingTotal(unitType, duration);
  const holdUnit = reserveAvailableUnit(unitType);
  const bookingId = `BK-${Date.now()}`;
  const expiresAt = new Date(Date.now() + PAYMENT_SETTINGS.proofWindowHours * 60 * 60 * 1000).toISOString();
  const instructions = createPaymentInstructions(bookingId, totalAmount);

  const booking = {
    id: bookingId,
    inquiryUserId: currentUser.id,
    unitType,
    holdUnitId: holdUnit ? holdUnit.id : null,
    holdUnitNumber: holdUnit ? holdUnit.number : 'To be assigned',
    checkIn,
    duration: Number(duration),
    name,
    email,
    phone,
    totalAmount,
    status: 'pending',
    expiresAt,
    paymentInstructions: instructions,
    createdAt: new Date().toISOString()
  };

  bookings.unshift(booking);
  paymentEmails.unshift({
    id: `MAIL-${Date.now()}`,
    bookingId,
    to: email,
    subject: `Payment instructions for ${bookingId}`,
    body: instructions,
    createdAt: new Date().toISOString()
  });

  saveArray(STORAGE_KEYS.bookings, bookings);
  saveArray(STORAGE_KEYS.paymentEmails, paymentEmails);
  saveArray(STORAGE_KEYS.units, units);
  localStorage.removeItem(STORAGE_KEYS.selectedBookingUnit);
  event.target.reset();
  hydrateSelectedBookingUnit();
  hydrateInquiryBookingDetails();
  renderInquiryBookingPayments();
  alert(`Booking ${bookingId} is pending. A demo email with payment instructions was created for ${email}.`);
}

function hydrateSelectedBookingUnit() {
  const selectedUnit = localStorage.getItem(STORAGE_KEYS.selectedBookingUnit);
  const unitSelect = document.getElementById('unit-type');
  if (selectedUnit && unitSelect) {
    unitSelect.value = selectedUnit;
  }
}

function hydrateInquiryBookingDetails() {
  if (!currentUser || currentUser.role !== 'inquiry') return;

  const storedUser = registeredUsers.find(user => user.id === currentUser.id || user.email === currentUser.email);
  const details = storedUser || currentUser;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  if (nameInput) nameInput.value = details.name || '';
  if (emailInput) emailInput.value = details.email || '';
  if (phoneInput) phoneInput.value = details.phone || '';
}

function renderInquiryBookingPayments() {
  const list = document.getElementById('booking-payment-list');
  if (!list) return;

  if (!currentUser || currentUser.role !== 'inquiry') {
    list.innerHTML = '<p class="section-help">Log in with an inquiry account to see pending payment instructions.</p>';
    return;
  }

  const userBookings = bookings.filter(item => item.inquiryUserId === currentUser.id || item.email === currentUser.email);

  list.innerHTML = userBookings.length
    ? userBookings.map(item => `
        <div class="booking-payment-card">
          <div>
            <h3>${item.id} - ${formatUnitType(item.unitType)}</h3>
            <p>Room: ${item.holdUnitNumber || 'To be assigned'} | Total: ${formatCurrency(item.totalAmount)}</p>
            <p>GCash: ${PAYMENT_SETTINGS.gcashNumber} - ${PAYMENT_SETTINGS.gcashName}</p>
            <p>Expires: ${formatDisplayDate(item.expiresAt)}</p>
            <span class="status-badge ${statusClass(item.status)}">${formatStatus(item.status)}</span>
          </div>
          ${item.status === 'pending' || item.status === 'payment-submitted'
            ? `<form class="auth-form compact-proof-form" onsubmit="submitBookingPaymentProof(event, '${item.id}')">
                <input type="text" id="booking-proof-${item.id}" value="${item.proofReference || ''}" placeholder="GCash reference number" required>
                <input type="file" id="booking-proof-file-${item.id}" accept="image/*,.pdf">
                <button type="submit" class="btn-small">Submit Proof</button>
              </form>`
            : ''}
        </div>
      `).join('')
    : '<p class="section-help">No booking payments yet. Submit a booking to create payment instructions.</p>';
}

function submitBookingPaymentProof(event, id) {
  event.preventDefault();

  const booking = bookings.find(item => item.id === id);
  if (!booking) return;

  const referenceInput = document.getElementById(`booking-proof-${id}`);
  const fileInput = document.getElementById(`booking-proof-file-${id}`);

  booking.status = 'payment-submitted';
  booking.proofReference = referenceInput ? referenceInput.value.trim() : '';
  booking.proofFileName = fileInput && fileInput.files.length ? fileInput.files[0].name : booking.proofFileName || 'Reference number only';
  booking.proofSubmittedAt = new Date().toISOString();

  saveArray(STORAGE_KEYS.bookings, bookings);
  refreshState();
  renderInquiryBookingPayments();
  alert('Proof submitted. Admin will review and confirm the booking manually.');
}

function calculateBookingTotal(unitType, duration) {
  const monthlyRate = BOOKING_PRICES[unitType] || BOOKING_PRICES.studio;
  return monthlyRate * (Number(duration) || 1);
}

function reserveAvailableUnit(unitType) {
  const normalizedType = formatUnitType(unitType).toLowerCase();
  const unit = units.find(item => {
    const type = String(item.type || '').toLowerCase();
    return item.status === 'available' && !item.tenantId && type.includes(normalizedType.split(' ')[0]);
  });

  if (unit) {
    unit.status = 'reserved';
  }

  return unit || null;
}

function releaseHeldUnit(unitId) {
  const unit = units.find(item => item.id === unitId);
  if (unit && !unit.tenantId) {
    unit.status = 'available';
  }
}

function createPaymentInstructions(referenceId, amount) {
  return [
    `Reference ID: ${referenceId}`,
    `Total Amount: ${formatCurrency(amount)}`,
    `Send payment via GCash to ${PAYMENT_SETTINGS.gcashNumber} (${PAYMENT_SETTINGS.gcashName}).`,
    `Submit your screenshot or reference number within ${PAYMENT_SETTINGS.proofWindowHours} hours for admin verification.`
  ].join('\n');
}

function formatUnitType(unitType) {
  const labels = {
    studio: 'Studio',
    '1bed': '1 Bedroom',
    '2bed': '2 Bedroom',
    '3bed': '3 Bedroom'
  };

  return labels[unitType] || unitType || 'Unit';
}

function submitContactMessage(event) {
  event.preventDefault();

  const message = {
    id: `MSG-${Date.now()}`,
    name: getInputValue('contact-name'),
    email: getInputValue('contact-email'),
    subject: getInputValue('subject'),
    message: getInputValue('message'),
    createdAt: new Date().toISOString()
  };

  if (!message.name || !message.email || !message.subject || !message.message) {
    alert('Please complete the contact form.');
    return;
  }

  contactMessages.unshift(message);
  saveArray(STORAGE_KEYS.contactMessages, contactMessages);
  event.target.reset();
  alert('Your message has been sent successfully.');
}

function checkLoginAndBook(unitType) {
  localStorage.setItem(STORAGE_KEYS.selectedBookingUnit, unitType || 'studio');

  if (currentUser && currentUser.role === 'inquiry') {
    window.location.href = 'booking.html';
    return;
  }

  openAuthModal('inquiry');
}

function closeUnitModal() {
  const modal = document.getElementById('unit-modal');
  if (modal) modal.classList.remove('active');
}

function refreshActivePage() {
  if (document.body.classList.contains('portal-body')) {
    initializeTenantPortal();
  }

  if (document.body.classList.contains('admin-body')) {
    initializeAdminPortal();
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function formatDisplayDate(value) {
  if (!value) return '--';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function toInputDate(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

function todayIso() {
  return new Date().toISOString().split('T')[0];
}

function statusClass(status) {
  return String(status).replace(/\s+/g, '-').toLowerCase();
}

function formatStatus(status) {
  return String(status || '').replace(/-/g, ' ');
}
