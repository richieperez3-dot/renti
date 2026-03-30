import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "renti_demo_data_v1";

const defaultData = {
  landlords: [
    {
      id: "ld-1",
      name: "John Doe",
      email: "john@example.com",
      phone: "(000) 000-0000",
    },
  ],
  properties: [
    {
      id: "prop-1",
      landlordEmail: "john@example.com",
      landlordName: "John Doe",
      entityName: "ABC Holdings LLC",
      address: "123 Main St Apt 1, City, State",
      monthlyRent: 2400,
      leaseStart: "2026-01-01",
      tenantName: "John Tenant",
      coverageStartMonth: "2026-03",
      status: "Active",
      uploadedLease: "Lease Agreement.pdf",
      supportingDocs: "Ownership Verification.pdf",
      createdAt: "2026-03-30",
    },
  ],
  claims: [
    {
      id: "clm-1",
      landlordEmail: "john@example.com",
      propertyId: "prop-1",
      propertyAddress: "123 Main St Apt 1, City, State",
      unpaidMonth: "2026-03",
      amountUnpaid: 2400,
      partialPayment: "No",
      ledgerFile: "Payment Ledger.pdf",
      noticeFile: "3 Day Notice.pdf",
      notes: "Tenant did not pay March rent.",
      status: "Pending Review",
      createdAt: "2026-03-30",
    },
  ],
};

function formatCurrency(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

function monthlyFee(rent) {
  return Number(rent || 0) * 0.02;
}

function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

import { useMemo, useState } from "react";

function formatCurrency(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

function monthlyFee(rent) {
  return Number(rent || 0) * 0.02;
}

const seedLandlords = [
  {
    id: "ld-1",
    name: "John Doe",
    entityName: "ABC Holdings LLC",
    email: "john@example.com",
    phone: "(000) 000-0000",
    billingStatus: "Active",
  },
];

const seedProperties = [
  {
    id: "prop-1",
    landlordId: "ld-1",
    address: "123 Main St Apt 1, City, State",
    monthlyRent: 2400,
    leaseStart: "2026-01-01",
    tenantName: "John Tenant",
    coverageStartMonth: "2026-03",
    status: "Active",
    leaseFile: "Lease Agreement.pdf",
    supportingDocs: "Ownership Verification.pdf",
  },
];

const seedClaims = [
  {
    id: "clm-1",
    propertyId: "prop-1",
    unpaidMonth: "2026-03",
    amountUnpaid: 2400,
    partialPayment: "No",
    ledgerFile: "Payment Ledger.pdf",
    noticeFile: "3 Day Notice.pdf",
    notes: "Sample claim for portal demonstration.",
    status: "Pending Review",
    submittedAt: "2026-03-30",
  },
];

export default function RentiWebsite() {
  const [activeView, setActiveView] = useState("landlord");
  const [landlords, setLandlords] = useState(seedLandlords);
  const [properties, setProperties] = useState(seedProperties);
  const [claims, setClaims] = useState(seedClaims);
  const [activeLandlordId, setActiveLandlordId] = useState("ld-1");
  const [loginEmail, setLoginEmail] = useState("john@example.com");
  const [adminMessage, setAdminMessage] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState("");
  const [claimSuccess, setClaimSuccess] = useState("");

  const [enrollmentForm, setEnrollmentForm] = useState({
    landlordName: "",
    entityName: "",
    email: "",
    phone: "",
    propertyAddress: "",
    monthlyRent: "",
    leaseStart: "",
    tenantName: "",
    coverageStartMonth: "",
    uploadedLease: "",
    supportingDocs: "",
  });

  const [claimForm, setClaimForm] = useState({
    propertyId: "",
    unpaidMonth: "",
    amountUnpaid: "",
    partialPayment: "No",
    ledgerFile: "",
    noticeFile: "",
    notes: "",
  });

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setDb(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
  }, [db]);

  const activeLandlord = useMemo(() => {
    return landlords.find((l) => l.id === activeLandlordId) || null;
  }, [landlords, activeLandlordId]);

  const landlordProperties = useMemo(() => {
    return properties.filter((p) => p.landlordId === activeLandlordId);
  }, [properties, activeLandlordId]);

  const landlordClaims = useMemo(() => {
    const propertyIds = new Set(landlordProperties.map((p) => p.id));
    return claims.filter((c) => propertyIds.has(c.propertyId));
  }, [claims, landlordProperties]);

  const totalBilling = useMemo(() => {
    return landlordProperties.reduce((sum, p) => sum + monthlyFee(p.monthlyRent), 0);
  }, [landlordProperties]);

  const adminStats = useMemo(() => ({
    landlords: landlords.length,
    properties: properties.length,
    claims: claims.length,
    pendingClaims: claims.filter((c) => c.status === "Pending Review").length,
  }), [landlords, properties, claims]);

  useEffect(() => {
    if (!claimForm.propertyId && landlordProperties.length) {
      setClaimForm((prev) => ({ ...prev, propertyId: landlordProperties[0].id }));
    }
  }, [landlordProperties, claimForm.propertyId]);

  const features = [
    "Predictable rental income",
    "Simple landlord onboarding",
    "Designed for apartments and condos",
    "Landlord portal plus admin review dashboard",
  ];

  const steps = [
    {
      number: "1",
      title: "Sign up your property",
      body: "Complete a short enrollment form with your property, lease, and tenant details.",
    },
    {
      number: "2",
      title: "Upload documents",
      body: "Submit the lease and supporting documents so Renti can review the tenancy.",
    },
    {
      number: "3",
      title: "Activate monthly protection",
      body: "Pay the monthly fee before the first of the month to activate that month’s protection.",
    },
    {
      number: "4",
      title: "File a claim if rent is missed",
      body: "If rent remains unpaid for 30 days, file a claim through the landlord portal.",
    },
  ];

  const faqs = [
    {
      q: "What does Renti cover?",
      a: "For approved properties and tenants, Renti can pay up to 3 months of missed rent, subject to the agreement, exclusions, underwriting, and timely payment of the monthly fee.",
    },
    {
      q: "When does protection apply?",
      a: "Protection applies only for months in which the monthly fee is paid on or before the first day of that month.",
    },
    {
      q: "How much does it cost?",
      a: "Renti currently charges 2% of the contracted monthly rent for approved properties.",
    },
    {
      q: "How do I file a claim?",
      a: "Landlords can file a claim in the portal by submitting the missed rent details, lease information, payment ledger, and supporting documents.",
    },
  ];

  function handleEnrollmentChange(field, value) {
    setEnrollmentForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleClaimChange(field, value) {
    setClaimForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePortalLogin(e) {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    const found = landlords.find((l) => l.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (found) {
      setActiveLandlordId(found.id);
      setActiveView("landlord");
    }
  }

  function handleEnrollmentSubmit(e) {
    e.preventDefault();
    if (!enrollmentForm.landlordName || !enrollmentForm.email || !enrollmentForm.propertyAddress || !enrollmentForm.monthlyRent) {
      setEnrollSuccess("Please complete the required enrollment fields.");
      return;
    }

    let landlord = landlords.find((l) => l.email.toLowerCase() === enrollmentForm.email.trim().toLowerCase());
    if (!landlord) {
      landlord = {
        id: `ld-${Date.now()}`,
        name: enrollmentForm.landlordName.trim(),
        entityName: enrollmentForm.entityName.trim(),
        email: enrollmentForm.email.trim(),
        phone: enrollmentForm.phone.trim(),
        billingStatus: "Pending Billing",
      };
      setLandlords((prev) => [landlord, ...prev]);
    }

    const newProperty = {
      id: `prop-${Date.now()}`,
      landlordId: landlord.id,
      address: enrollmentForm.propertyAddress.trim(),
      monthlyRent: Number(enrollmentForm.monthlyRent),
      leaseStart: enrollmentForm.leaseStart,
      tenantName: enrollmentForm.tenantName.trim(),
      coverageStartMonth: enrollmentForm.coverageStartMonth,
      status: "Pending Review",
      leaseFile: enrollmentForm.uploadedLease || "Lease Agreement.pdf",
      supportingDocs: enrollmentForm.supportingDocs || "Supporting Document.pdf",
    };

    setProperties((prev) => [newProperty, ...prev]);
    setActiveLandlordId(landlord.id);
    setLoginEmail(landlord.email);
    setEnrollSuccess("Enrollment submitted. The property now appears in the portal and admin dashboard.");
    setEnrollmentForm({
      landlordName: "",
      entityName: "",
      email: "",
      phone: "",
      propertyAddress: "",
      monthlyRent: "",
      leaseStart: "",
      tenantName: "",
      coverageStartMonth: "",
      uploadedLease: "",
      supportingDocs: "",
    });
  }

    const landlordExists = db.landlords.some(
      (l) => l.email.toLowerCase() === enrollmentForm.email.trim().toLowerCase()
    );

    const newLandlord = landlordExists
      ? null
      : {
          id: generateId("ld"),
          name: enrollmentForm.landlordName.trim(),
          email: enrollmentForm.email.trim(),
          phone: enrollmentForm.phone.trim(),
        };

    const newProperty = {
      id: generateId("prop"),
      landlordEmail: enrollmentForm.email.trim(),
      landlordName: enrollmentForm.landlordName.trim(),
      entityName: enrollmentForm.entityName.trim(),
      address: enrollmentForm.propertyAddress.trim(),
      monthlyRent: Number(enrollmentForm.monthlyRent),
      leaseStart: enrollmentForm.leaseStart,
      tenantName: enrollmentForm.tenantName.trim(),
      coverageStartMonth: enrollmentForm.coverageStartMonth,
      status: "Pending Review",
      uploadedLease: enrollmentForm.uploadedLease || "Lease upload pending",
      supportingDocs: enrollmentForm.supportingDocs || "Supporting documents pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setDb((prev) => ({
      landlords: newLandlord ? [...prev.landlords, newLandlord] : prev.landlords,
      properties: [newProperty, ...prev.properties],
      claims: prev.claims,
    }));

    setActivePortalEmail(enrollmentForm.email.trim());
    setLoginEmail(enrollmentForm.email.trim());
    setEnrollSuccess("Enrollment submitted. Your landlord account and property record have been created.");
    setEnrollmentForm({
      landlordName: "",
      entityName: "",
      email: "",
      phone: "",
      propertyAddress: "",
      monthlyRent: "",
      leaseStart: "",
      tenantName: "",
      coverageStartMonth: "",
      uploadedLease: "",
      supportingDocs: "",
    });
  }

  function handleClaimSubmit(e) {
    e.preventDefault();
    const selectedProperty = landlordProperties.find((p) => p.id === claimForm.propertyId);
    if (!selectedProperty || !claimForm.unpaidMonth || !claimForm.amountUnpaid) {
      setClaimSuccess("Please complete the required claim fields.");
      return;
    }

    const newClaim = {
      id: `clm-${Date.now()}`,
      propertyId: selectedProperty.id,
      unpaidMonth: claimForm.unpaidMonth,
      amountUnpaid: Number(claimForm.amountUnpaid),
      partialPayment: claimForm.partialPayment,
      ledgerFile: claimForm.ledgerFile || "Payment Ledger.pdf",
      noticeFile: claimForm.noticeFile || "Supporting Document.pdf",
      notes: claimForm.notes,
      status: "Pending Review",
      submittedAt: new Date().toISOString().slice(0, 10),
    };

    setClaims((prev) => [newClaim, ...prev]);
    setClaimSuccess("Claim submitted successfully. The claim is now in the landlord portal and admin dashboard.");
    setClaimForm({
      propertyId: selectedProperty.id,
      unpaidMonth: "",
      amountUnpaid: "",
      partialPayment: "No",
      ledgerFile: "",
      noticeFile: "",
      notes: "",
    });
  }

  function updatePropertyStatus(propertyId, status) {
    setProperties((prev) => prev.map((p) => (p.id === propertyId ? { ...p, status } : p)));
    setAdminMessage(`Property marked ${status.toLowerCase()}.`);
  }

  function updateClaimStatus(claimId, status) {
    setClaims((prev) => prev.map((c) => (c.id === claimId ? { ...c, status } : c)));
    setAdminMessage(`Claim marked ${status.toLowerCase()}.`);
  }

  function updateBillingStatus(landlordId, status) {
    setLandlords((prev) => prev.map((l) => (l.id === landlordId ? { ...l, billingStatus: status } : l)));
    setAdminMessage(`Billing marked ${status.toLowerCase()}.`);
  }

    const newClaim = {
      id: generateId("clm"),
      landlordEmail: activePortalEmail,
      propertyId: selectedProperty.id,
      propertyAddress: selectedProperty.address,
      unpaidMonth: claimForm.unpaidMonth,
      amountUnpaid: Number(claimForm.amountUnpaid),
      partialPayment: claimForm.partialPayment,
      ledgerFile: claimForm.ledgerFile || "Ledger upload pending",
      noticeFile: claimForm.noticeFile || "Supporting documents pending",
      notes: claimForm.notes,
      status: "Pending Review",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setDb((prev) => ({
      ...prev,
      claims: [newClaim, ...prev.claims],
    }));

    setClaimSuccess("Claim submitted successfully. It now appears in the portal.");
    setClaimForm({
      propertyId: selectedProperty.id,
      unpaidMonth: "",
      amountUnpaid: "",
      partialPayment: "No",
      ledgerFile: "",
      noticeFile: "",
      notes: "",
    });
  }

  const latestProperty = landlordProperties[0];
  const latestClaim = landlordClaims[0];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-600">
              <svg viewBox="0 0 64 64" className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 30c3-10 11-16 20-16s17 6 20 16" />
                <path d="M18 30v10a6 6 0 0 0 6 6h2" />
                <path d="M46 30v10a6 6 0 0 1-6 6h-2" />
                <path d="M32 14v25" />
                <path d="M32 39c0 5-2 8-6 10" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-semibold tracking-[0.18em] text-blue-700">RENTI</div>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Rent guarantee platform</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <button onClick={() => setActiveView("landlord")} className="transition hover:text-slate-900">Landlord site</button>
            <button onClick={() => setActiveView("admin")} className="transition hover:text-slate-900">Admin dashboard</button>
            <a href="#how-it-works" className="transition hover:text-slate-900">How it works</a>
            <a href="#faq" className="transition hover:text-slate-900">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#portal" className="hidden rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 md:inline-flex">
              Sign In
            </a>
            <a href="#signup" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
              Enroll Now
            </a>
          </div>
        </div>
      </header>

      <main>
        {activeView === "landlord" ? (
          <>
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
              <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
                <div>
                  <div className="mb-5 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 shadow-sm">
                    Built for small landlords with apartments and condos
                  </div>
                  <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                    Stabilize your rental income.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                    Renti helps landlords enroll eligible properties online, manage documents, and file claims for unpaid rent through a simple landlord portal.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href="#signup" className="rounded-full bg-blue-600 px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
                      Start Enrollment
                    </a>
                    <a href="#portal" className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900">
                      View Landlord Portal
                    </a>
                  </div>
                  <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200 pt-6 text-sm">
                    <div>
                      <div className="text-2xl font-semibold text-slate-950">3 months</div>
                      <div className="mt-1 text-slate-600">Maximum rent guarantee</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-slate-950">30 days</div>
                      <div className="mt-1 text-slate-600">Claim trigger</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-slate-950">2%</div>
                      <div className="mt-1 text-slate-600">Monthly fee</div>
                    </div>
                  </div>
                </div>

                <div className="lg:justify-self-end">
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-slate-500">Active property</div>
                        <div className="text-xl font-semibold text-slate-950">{latestProperty?.address || "No property yet"}</div>
                      </div>
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        {latestProperty?.status || "Pending"}
                      </div>
                    </div>
                    <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Monthly rent</span>
                        <span className="font-medium text-slate-900">{formatCurrency(latestProperty?.monthlyRent || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Monthly Renti fee</span>
                        <span className="font-medium text-slate-900">{formatCurrency(monthlyFee(latestProperty?.monthlyRent || 0))}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Rent guarantee</span>
                        <span className="font-medium text-slate-900">{formatCurrency((latestProperty?.monthlyRent || 0) * 3)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Billing</span>
                        <span className="font-medium text-slate-900">{activeLandlord?.billingStatus || "Pending Billing"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-y border-slate-200 bg-slate-50/70">
              <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 text-sm text-slate-600 lg:grid-cols-4 lg:px-8">
                {features.map((item) => (
                  <div key={item} className="rounded-2xl bg-white px-5 py-4 shadow-sm">{item}</div>
                ))}
              </div>
            </section>

            <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
              <div className="max-w-2xl">
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">How it works</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  A cleaner path from enrollment to claims.
                </h2>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {steps.map((step) => (
                  <div key={step.number} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">{step.number}</div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-950">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="signup" className="border-t border-slate-200 bg-white">
              <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:px-8">
                <div>
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Enroll your property</div>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Complete your landlord sign-up online.
                  </h2>
                </div>
                <form onSubmit={handleEnrollmentSubmit} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-xl shadow-slate-200/40">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Landlord name</label><input value={enrollmentForm.landlordName} onChange={(e) => handleEnrollmentChange("landlordName", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" placeholder="John Doe" /></div>
                    <div className="sm:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Entity name</label><input value={enrollmentForm.entityName} onChange={(e) => handleEnrollmentChange("entityName", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" placeholder="ABC Holdings LLC" /></div>
                    <div><label className="mb-2 block text-sm font-medium text-slate-700">Email</label><input value={enrollmentForm.email} onChange={(e) => handleEnrollmentChange("email", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" placeholder="john@example.com" /></div>
                    <div><label className="mb-2 block text-sm font-medium text-slate-700">Phone</label><input value={enrollmentForm.phone} onChange={(e) => handleEnrollmentChange("phone", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" placeholder="(000) 000-0000" /></div>
                    <div className="sm:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Property address</label><input value={enrollmentForm.propertyAddress} onChange={(e) => handleEnrollmentChange("propertyAddress", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" placeholder="123 Main St Apt 1, City, State" /></div>
                    <div><label className="mb-2 block text-sm font-medium text-slate-700">Monthly rent</label><input value={enrollmentForm.monthlyRent} onChange={(e) => handleEnrollmentChange("monthlyRent", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" placeholder="2400" /></div>
                    <div><label className="mb-2 block text-sm font-medium text-slate-700">Lease start date</label><input type="date" value={enrollmentForm.leaseStart} onChange={(e) => handleEnrollmentChange("leaseStart", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" /></div>
                    <div><label className="mb-2 block text-sm font-medium text-slate-700">Tenant name</label><input value={enrollmentForm.tenantName} onChange={(e) => handleEnrollmentChange("tenantName", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" placeholder="John Tenant" /></div>
                    <div><label className="mb-2 block text-sm font-medium text-slate-700">Coverage start month</label><input type="month" value={enrollmentForm.coverageStartMonth} onChange={(e) => handleEnrollmentChange("coverageStartMonth", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" /></div>
                    <div className="sm:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Lease file name</label><input value={enrollmentForm.uploadedLease} onChange={(e) => handleEnrollmentChange("uploadedLease", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Lease Agreement.pdf" /></div>
                    <div className="sm:col-span-2"><label className="mb-2 block text-sm font-medium text-slate-700">Supporting document file name</label><input value={enrollmentForm.supportingDocs} onChange={(e) => handleEnrollmentChange("supportingDocs", e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Ownership Verification.pdf" /></div>
                  </div>
                  <button type="submit" className="mt-6 w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">Create Landlord Account</button>
                  {enrollSuccess ? <p className="mt-4 text-sm text-blue-700">{enrollSuccess}</p> : null}
                </form>
              </div>
            </section>

            <section id="portal" className="bg-slate-950 text-white">
              <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Landlord portal</div>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Manage properties, billing, documents, and claims.</h2>
                    <form onSubmit={handlePortalLogin} className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                      <label className="mb-2 block text-sm font-medium text-slate-200">Portal email</label>
                      <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none" placeholder="john@example.com" />
                      <button type="submit" className="mt-4 w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100">Load Portal</button>
                    </form>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm text-slate-300">Signed in as</div>
                        <div className="mt-1 text-xl font-semibold">{activeLandlord?.name || "Unknown landlord"}</div>
                        <div className="text-sm text-slate-400">{activeLandlord?.email || loginEmail}</div>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-white/10 p-5"><div className="text-sm text-slate-300">Properties</div><div className="mt-2 text-3xl font-semibold">{landlordProperties.length}</div></div>
                      <div className="rounded-2xl bg-white/10 p-5"><div className="text-sm text-slate-300">Open claims</div><div className="mt-2 text-3xl font-semibold">{landlordClaims.length}</div></div>
                      <div className="rounded-2xl bg-white/10 p-5"><div className="text-sm text-slate-300">Monthly billing</div><div className="mt-2 text-3xl font-semibold">{formatCurrency(totalBilling)}</div></div>
                    </div>
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-white p-5 text-slate-900">
                          <div className="text-lg font-semibold">Properties</div>
                          <div className="mt-4 space-y-4">
                            {landlordProperties.map((property) => (
                              <div key={property.id} className="rounded-2xl border border-slate-200 p-4">
                                <div className="font-semibold">{property.address}</div>
                                <div className="mt-1 text-sm text-slate-500">Tenant: {property.tenantName || "Not provided"}</div>
                                <div className="mt-3 text-sm">Status: {property.status}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white p-5 text-slate-900">
                          <div className="text-lg font-semibold">Claims</div>
                          <div className="mt-4 space-y-4">
                            {landlordClaims.map((claim) => (
                              <div key={claim.id} className="rounded-2xl border border-slate-200 p-4">
                                <div className="font-semibold">{claim.unpaidMonth}</div>
                                <div className="mt-1 text-sm text-slate-500">Amount: {formatCurrency(claim.amountUnpaid)}</div>
                                <div className="mt-1 text-sm text-slate-500">Status: {claim.status}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="text-lg font-semibold">File a claim</div>
                        <form onSubmit={handleClaimSubmit} className="mt-6 space-y-4">
                          <div><label className="mb-2 block text-sm font-medium text-slate-200">Select property</label><select value={claimForm.propertyId} onChange={(e) => handleClaimChange("propertyId", e.target.value)} className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none">{landlordProperties.map((property) => (<option key={property.id} value={property.id} className="text-slate-900">{property.address}</option>))}</select></div>
                          <div><label className="mb-2 block text-sm font-medium text-slate-200">Month of unpaid rent</label><input type="month" value={claimForm.unpaidMonth} onChange={(e) => handleClaimChange("unpaidMonth", e.target.value)} className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none" /></div>
                          <div><label className="mb-2 block text-sm font-medium text-slate-200">Amount unpaid</label><input value={claimForm.amountUnpaid} onChange={(e) => handleClaimChange("amountUnpaid", e.target.value)} className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none" placeholder="2400" /></div>
                          <div><label className="mb-2 block text-sm font-medium text-slate-200">Partial payment?</label><select value={claimForm.partialPayment} onChange={(e) => handleClaimChange("partialPayment", e.target.value)} className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"><option className="text-slate-900">No</option><option className="text-slate-900">Yes</option></select></div>
                          <button type="submit" className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100">Submit Claim</button>
                          {claimSuccess ? <p className="text-sm text-emerald-300">{claimSuccess}</p> : null}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="faq" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
              <div className="max-w-2xl">
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">FAQ</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Common questions.</h2>
              </div>
              <div className="mt-12 grid gap-6 lg:grid-cols-2">
                {faqs.map((item) => (
                  <div key={item.q} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-950">{item.q}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="min-h-[80vh] bg-slate-100 px-6 py-14 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Renti admin</div>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Admin dashboard</h2>
                </div>
                <button onClick={() => setActiveView("landlord")} className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700">Back to landlord site</button>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Landlords</div><div className="mt-2 text-3xl font-semibold">{adminStats.landlords}</div></div>
                <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Properties</div><div className="mt-2 text-3xl font-semibold">{adminStats.properties}</div></div>
                <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Claims</div><div className="mt-2 text-3xl font-semibold">{adminStats.claims}</div></div>
                <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="text-sm text-slate-500">Pending claims</div><div className="mt-2 text-3xl font-semibold">{adminStats.pendingClaims}</div></div>
              </div>
              {adminMessage ? <div className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700">{adminMessage}</div> : null}

              <div className="mt-8 grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-1">
                  <div className="text-lg font-semibold text-slate-950">Landlords</div>
                  <div className="mt-4 space-y-4">
                    {landlords.map((landlord) => (
                      <div key={landlord.id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="font-semibold">{landlord.name}</div>
                        <div className="mt-1 text-sm text-slate-500">{landlord.email}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => updateBillingStatus(landlord.id, "Active")} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Mark Active</button>
                          <button onClick={() => updateBillingStatus(landlord.id, "Past Due")} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">Mark Past Due</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-1">
                  <div className="text-lg font-semibold text-slate-950">Properties</div>
                  <div className="mt-4 space-y-4">
                    {properties.map((property) => (
                      <div key={property.id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="font-semibold">{property.address}</div>
                        <div className="mt-1 text-sm text-slate-500">Rent: {formatCurrency(property.monthlyRent)}</div>
                        <div className="mt-1 text-sm text-slate-500">Status: {property.status}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => updatePropertyStatus(property.id, "Active")} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Approve</button>
                          <button onClick={() => updatePropertyStatus(property.id, "Denied")} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">Deny</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-1">
                  <div className="text-lg font-semibold text-slate-950">Claims</div>
                  <div className="mt-4 space-y-4">
                    {claims.map((claim) => (
                      <div key={claim.id} className="rounded-2xl border border-slate-200 p-4">
                        <div className="font-semibold">{claim.unpaidMonth}</div>
                        <div className="mt-1 text-sm text-slate-500">Amount: {formatCurrency(claim.amountUnpaid)}</div>
                        <div className="mt-1 text-sm text-slate-500">Status: {claim.status}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => updateClaimStatus(claim.id, "Approved")} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Approve</button>
                          <button onClick={() => updateClaimStatus(claim.id, "Denied")} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">Deny</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="font-semibold tracking-[0.18em] text-blue-700">RENTI</div>
            <div className="mt-1">Predictable rental income for small landlords.</div>
          </div>
          <div className="max-w-xl text-xs leading-5 text-slate-500 md:text-right">
            Renti is not insurance. Any payment obligation is subject to program terms, underwriting, exclusions, and timely payment of monthly fees.
          </div>
        </div>
      </footer>
    </div>
  );
}
