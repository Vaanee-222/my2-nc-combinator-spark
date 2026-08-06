import RecordManager, { StatusBadge } from "@/components/dashboard/RecordManager";

const dateCell = (row: any) => (
  <span className="text-sm text-muted-foreground">
    {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
  </span>
);

/* ------------------------------------------------------------------ */
/* Consultation bookings                                               */
/* ------------------------------------------------------------------ */
export const ConsultationsAdmin = () => (
  <RecordManager
    table="consultation_bookings"
    notify={{ emailKey: "email", nameKey: "name", contextKey: "consultation_type", label: "Consultation booking", approvedValues: ["scheduled", "completed"], rejectedValues: ["cancelled"] }}
    title="Consultation Booking"
    description="Every consultation request submitted from the website."
    allowCreate={false}
    statusKey="status"
    statusOptions={["pending", "scheduled", "completed", "cancelled"]}
    searchKeys={["name", "email", "company", "consultation_type"]}
    columns={[
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "company", label: "Company" },
      { key: "consultation_type", label: "Type" },
      { key: "preferred_date", label: "Preferred" },
      { key: "status", label: "Status", render: (r) => <StatusBadge value={r.status} /> },
      { key: "created_at", label: "Received", render: dateCell },
    ]}
    editableFields={["status", "admin_notes"]}
    fields={[
      { key: "name", label: "Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone" },
      { key: "company", label: "Company" },
      { key: "consultation_type", label: "Consultation type", required: true },
      { key: "preferred_date", label: "Preferred date" },
      { key: "preferred_time", label: "Preferred time" },
      { key: "message", label: "Message", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: ["pending", "scheduled", "completed", "cancelled"] },
      { key: "admin_notes", label: "Admin notes", type: "textarea" },
    ]}
  />
);

/* ------------------------------------------------------------------ */
/* Grants                                                              */
/* ------------------------------------------------------------------ */
export const GrantsAdmin = () => (
  <RecordManager
    table="grants"
    title="Grant"
    description="Publish and manage the grants shown on the Grants & Funding page."
    orderBy="sort_order"
    searchKeys={["name", "grant_type", "focus"]}
    statusKey="status"
    statusOptions={["Open", "Closing Soon", "Closed"]}
    defaults={{ is_active: true, status: "Open" }}
    columns={[
      { key: "name", label: "Grant" },
      { key: "amount", label: "Amount" },
      { key: "grant_type", label: "Type" },
      { key: "focus", label: "Focus" },
      { key: "deadline", label: "Deadline" },
      { key: "status", label: "Status", render: (r) => <StatusBadge value={r.status} /> },
      { key: "is_active", label: "Live", render: (r) => (r.is_active ? "Yes" : "No") },
    ]}
    fields={[
      { key: "name", label: "Grant name", required: true },
      { key: "amount", label: "Amount (e.g. $600,000)" },
      { key: "grant_type", label: "Grant type" },
      { key: "focus", label: "Focus area" },
      { key: "deadline", label: "Deadline" },
      { key: "application_process", label: "Application cadence" },
      { key: "status", label: "Status", type: "select", options: ["Open", "Closing Soon", "Closed"] },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sectors", label: "Sectors (one per line)", type: "array" },
      { key: "eligibility", label: "Eligibility (one per line)", type: "array" },
      { key: "benefits", label: "Benefits (one per line)", type: "array" },
      { key: "is_active", label: "Visible on site", type: "switch" },
    ]}
  />
);

export const GrantApplicationsAdmin = () => (
  <RecordManager
    table="grant_applications"
    notify={{ emailKey: "email", nameKey: "applicant_name", contextKey: "grant_name", label: "Grant application", approvedValues: ["approved", "shortlisted"], rejectedValues: ["rejected"] }}
    title="Grant Application"
    description="Review founder applications submitted against published grants."
    allowCreate={false}
    statusKey="status"
    statusOptions={["submitted", "under_review", "shortlisted", "approved", "rejected"]}
    searchKeys={["applicant_name", "email", "startup_name", "grant_name"]}
    columns={[
      { key: "applicant_name", label: "Applicant" },
      { key: "email", label: "Email" },
      { key: "startup_name", label: "Startup" },
      { key: "grant_name", label: "Grant" },
      { key: "funding_ask", label: "Ask" },
      { key: "status", label: "Status", render: (r) => <StatusBadge value={r.status} /> },
      { key: "created_at", label: "Received", render: dateCell },
    ]}
    editableFields={["status", "admin_notes"]}
    fields={[
      { key: "applicant_name", label: "Applicant" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "startup_name", label: "Startup" },
      { key: "grant_name", label: "Grant" },
      { key: "sector", label: "Sector" },
      { key: "stage", label: "Stage" },
      { key: "funding_ask", label: "Funding ask" },
      { key: "proposal", label: "Proposal", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: ["submitted", "under_review", "shortlisted", "approved", "rejected"] },
      { key: "admin_notes", label: "Reviewer notes", type: "textarea" },
    ]}
  />
);

/* ------------------------------------------------------------------ */
/* Subscriptions                                                       */
/* ------------------------------------------------------------------ */
export const SubscriptionPlansAdmin = () => (
  <RecordManager
    table="subscription_plans"
    title="Plan"
    description="Memberships, subscriptions and services shown on the pricing page."
    orderBy="sort_order"
    searchKeys={["name", "category", "tier"]}
    columns={[
      { key: "name", label: "Plan" },
      { key: "category", label: "Category" },
      { key: "price_usd", label: "Price (USD)", render: (r) => `$${Number(r.price_usd ?? 0).toLocaleString()}` },
      { key: "billing_period", label: "Billing" },
      { key: "is_popular", label: "Highlighted", render: (r) => (r.is_popular ? "Yes" : "No") },
      { key: "is_active", label: "Live", render: (r) => (r.is_active ? "Yes" : "No") },
    ]}
    defaults={{ is_active: true, category: "membership", billing_period: "monthly" }}
    fields={[
      { key: "name", label: "Plan name", required: true },
      { key: "category", label: "Category", type: "select", options: ["membership", "subscription", "service"] },
      { key: "tier", label: "Tier label" },
      { key: "price_usd", label: "Price in USD", type: "number" },
      { key: "billing_period", label: "Billing period", type: "select", options: ["monthly", "quarterly", "yearly", "one-time"] },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "features", label: "Features (one per line)", type: "array" },
      { key: "is_popular", label: "Highlight as popular", type: "switch" },
      { key: "is_active", label: "Visible on site", type: "switch" },
    ]}
  />
);

export const SubscriptionPurchasesAdmin = () => (
  <RecordManager
    table="subscription_purchases"
    title="Purchase"
    description="Complete purchase history across memberships, subscriptions and services."
    allowCreate={false}
    statusKey="status"
    statusOptions={["active", "pending", "cancelled", "expired"]}
    orderBy="purchased_at"
    searchKeys={["plan_name", "buyer_email", "reference"]}
    columns={[
      { key: "plan_name", label: "Plan" },
      { key: "buyer_email", label: "Buyer" },
      { key: "amount_usd", label: "Amount", render: (r) => `$${Number(r.amount_usd ?? 0).toLocaleString()}` },
      { key: "billing_period", label: "Billing" },
      { key: "reference", label: "Reference" },
      { key: "status", label: "Status", render: (r) => <StatusBadge value={r.status} /> },
      { key: "purchased_at", label: "Purchased", render: (r) => <span className="text-sm text-muted-foreground">{r.purchased_at ? new Date(r.purchased_at).toLocaleDateString() : "—"}</span> },
    ]}
    editableFields={["status", "expires_at"]}
    fields={[
      { key: "plan_name", label: "Plan" },
      { key: "buyer_email", label: "Buyer email" },
      { key: "amount_usd", label: "Amount (USD)", type: "number" },
      { key: "billing_period", label: "Billing period" },
      { key: "reference", label: "Reference" },
      { key: "status", label: "Status", type: "select", options: ["active", "pending", "cancelled", "expired"] },
      { key: "expires_at", label: "Expires at (ISO date)" },
    ]}
  />
);

/* ------------------------------------------------------------------ */
/* Deals                                                               */
/* ------------------------------------------------------------------ */
export const DealsAdmin = () => (
  <RecordManager
    table="deal_offers"
    notify={{ emailKey: "contact_email", nameKey: "company_name", contextKey: "title", label: "Deal submission" }}
    title="Deal"
    description="Offers submitted by startups and partners. Approve to publish on the Deals page."
    statusKey="status"
    statusOptions={["pending", "approved", "rejected", "expired"]}
    searchKeys={["company_name", "title", "category", "contact_email"]}
    defaults={{ status: "pending" }}
    columns={[
      { key: "company_name", label: "Company" },
      { key: "title", label: "Offer" },
      { key: "category", label: "Category" },
      { key: "offer_value", label: "Value" },
      { key: "discount", label: "Discount" },
      { key: "valid_until", label: "Valid until" },
      { key: "status", label: "Status", render: (r) => <StatusBadge value={r.status} /> },
      { key: "created_at", label: "Submitted", render: dateCell },
    ]}
    fields={[
      { key: "company_name", label: "Company", required: true },
      { key: "title", label: "Offer title", required: true },
      { key: "category", label: "Category", type: "select", options: ["Cloud Services", "Productivity", "Payments", "Marketing", "Legal & Finance", "Developer Tools", "Other"] },
      { key: "offer_value", label: "Offer value (e.g. $5,000)" },
      { key: "discount", label: "Discount label" },
      { key: "valid_until", label: "Valid until" },
      { key: "promo_code", label: "Promo code" },
      { key: "redemption_url", label: "Redemption URL" },
      { key: "contact_email", label: "Contact email", required: true },
      { key: "logo_url", label: "Logo URL" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: ["pending", "approved", "rejected", "expired"] },
      { key: "admin_notes", label: "Admin notes", type: "textarea" },
      { key: "is_featured", label: "Feature on Deals page", type: "switch" },
    ]}
  />
);

/* ------------------------------------------------------------------ */
/* Cloud credits                                                       */
/* ------------------------------------------------------------------ */
export const CloudCreditsAdmin = () => (
  <RecordManager
    table="cloud_credit_requests"
    notify={{ emailKey: "email", nameKey: "applicant_name", contextKey: "provider", label: "Cloud credit request" }}
    title="Cloud Credit Request"
    description="Founder requests for cloud credits across providers."
    allowCreate={false}
    statusKey="status"
    statusOptions={["pending", "under_review", "approved", "rejected"]}
    searchKeys={["applicant_name", "email", "startup_name", "provider"]}
    columns={[
      { key: "applicant_name", label: "Applicant" },
      { key: "email", label: "Email" },
      { key: "startup_name", label: "Startup" },
      { key: "provider", label: "Provider" },
      { key: "credit_amount", label: "Requested" },
      { key: "status", label: "Status", render: (r) => <StatusBadge value={r.status} /> },
      { key: "created_at", label: "Received", render: dateCell },
    ]}
    editableFields={["status", "admin_notes"]}
    fields={[
      { key: "applicant_name", label: "Applicant" },
      { key: "email", label: "Email" },
      { key: "startup_name", label: "Startup" },
      { key: "provider", label: "Provider" },
      { key: "credit_amount", label: "Credit amount" },
      { key: "stage", label: "Stage" },
      { key: "use_case", label: "Use case", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: ["pending", "under_review", "approved", "rejected"] },
      { key: "admin_notes", label: "Admin notes", type: "textarea" },
    ]}
  />
);

/* ------------------------------------------------------------------ */
/* Investor inquiries                                                  */
/* ------------------------------------------------------------------ */
export const InvestorInquiriesAdmin = () => (
  <RecordManager
    table="investor_inquiries"
    notify={{ emailKey: "email", nameKey: "investor_name", contextKey: "startup_name", label: "Investment inquiry", approvedValues: ["accepted"], rejectedValues: ["declined"] }}
    title="Investor Inquiry"
    description="Investor-side interest. Pitch decks are never collected on this form."
    allowCreate={false}
    statusKey="status"
    statusOptions={["pending", "reviewing", "accepted", "declined"]}
    searchKeys={["investor_name", "email", "firm", "startup_name"]}
    columns={[
      { key: "investor_name", label: "Investor" },
      { key: "firm", label: "Fund / Firm" },
      { key: "email", label: "Email" },
      { key: "startup_name", label: "Startup" },
      { key: "ticket_size", label: "Ticket" },
      { key: "instrument", label: "Instrument" },
      { key: "status", label: "Status", render: (r) => <StatusBadge value={r.status} /> },
      { key: "created_at", label: "Received", render: dateCell },
    ]}
    editableFields={["status", "admin_notes"]}
    fields={[
      { key: "investor_name", label: "Investor" },
      { key: "firm", label: "Fund / Firm" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "startup_name", label: "Startup" },
      { key: "investor_type", label: "Investor type" },
      { key: "ticket_size", label: "Ticket size" },
      { key: "stage_preference", label: "Stage preference" },
      { key: "instrument", label: "Instrument" },
      { key: "timeline", label: "Timeline" },
      { key: "profile_url", label: "Profile" },
      { key: "message", label: "Message", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: ["pending", "reviewing", "accepted", "declined"] },
      { key: "admin_notes", label: "Admin notes", type: "textarea" },
    ]}
  />
);

/* ------------------------------------------------------------------ */
/* Contact messages                                                    */
/* ------------------------------------------------------------------ */
export const ContactMessagesAdmin = () => (
  <RecordManager
    table="contact_messages"
    title="Contact Message"
    description="Messages submitted from the public Contact page."
    allowCreate={false}
    statusKey="status"
    statusOptions={["new", "in_progress", "responded", "closed"]}
    searchKeys={["name", "email", "subject", "message"]}
    columns={[
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "subject", label: "Subject" },
      { key: "message", label: "Message" },
      { key: "status", label: "Status", render: (r) => <StatusBadge value={r.status} /> },
      { key: "created_at", label: "Received", render: dateCell },
    ]}
    editableFields={["status", "admin_notes"]}
    fields={[
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "subject", label: "Subject" },
      { key: "message", label: "Message", type: "textarea" },
      { key: "status", label: "Status", type: "select", options: ["new", "in_progress", "responded", "closed"] },
      { key: "admin_notes", label: "Admin notes", type: "textarea" },
    ]}
    emptyMessage="No contact messages yet."
  />
);
