export default function Home() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>RENTI</h1>
      <p style={{ fontSize: "20px", marginBottom: "24px" }}>
        Predictable rental income for small landlords.
      </p>

      <section style={{ marginBottom: "40px" }}>
        <h2>How it works</h2>
        <p>Enroll your property, upload your lease, and file claims for unpaid rent through the landlord portal.</p>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>Pricing</h2>
        <p>2% of monthly rent</p>
        <p>Up to 3 months of missed rent</p>
        <p>Claim trigger after 30 days of non-payment</p>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>Enroll Your Property</h2>
        <form style={{ display: "grid", gap: "12px", maxWidth: "500px" }}>
          <input placeholder="Landlord name" style={{ padding: "12px" }} />
          <input placeholder="Entity name" style={{ padding: "12px" }} />
          <input placeholder="Email" style={{ padding: "12px" }} />
          <input placeholder="Phone" style={{ padding: "12px" }} />
          <input placeholder="Property address" style={{ padding: "12px" }} />
          <input placeholder="Monthly rent" style={{ padding: "12px" }} />
          <button type="button" style={{ padding: "12px", background: "black", color: "white", border: "none" }}>
            Submit
          </button>
        </form>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>Landlord Portal</h2>
        <p>Portal demo coming next.</p>
      </section>

      <section>
        <h2>File a Claim</h2>
        <p>Claim flow coming next.</p>
      </section>
    </main>
  );
}
