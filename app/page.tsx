import Link from "next/link";

export default function Home() {
  return (
    <main className="shell workbook-home" translate="no">
      <header className="topbar">
        <div>
          <p className="eyebrow">Mapping Me</p>
          <h1>Workbook Library</h1>
        </div>
      </header>

      <section className="privacy-note">
        <strong>Private by default.</strong> Workbook notes save in this browser on this device. They are not uploaded.
      </section>

      <nav className="workbook-library" aria-label="Workbook library">
        <Link href="/workbook/energy_map">
          <span>Energy Map</span>
          <p>Track daily energy, attention, load, and recovery patterns.</p>
        </Link>
        <Link href="/workbook/sensory_map">
          <span>Sensory Map</span>
          <p>Explore sensory channels, profile patterns, and support ideas.</p>
        </Link>
        <Link href="/workbook/learning_style_map">
          <span>Learning Style Map</span>
          <p>Notice learning formats, processing styles, and useful scaffolds.</p>
        </Link>
        <Link href="/workbook/discovering_my_values">
          <span>Discovering My Values</span>
          <p>Gather small clues about what matters without forcing a final answer.</p>
        </Link>
        <Link href="/workbook/what_i_love_about_myself">
          <span>What I Love About Myself</span>
          <p>Gather specific, believable evidence of self-appreciation.</p>
        </Link>
        <Link href="/workbook/checking_in_with_my_body">
          <span>Checking-In With My Body</span>
          <p>Notice body signals, sensory load, energy texture, and small needs.</p>
        </Link>
      </nav>

      <section className="development-section" aria-labelledby="development-title">
        <div className="development-note">
          <h2 id="development-title">In development</h2>
          <p>To nudge these workbooks forward, contact contact@run2achieve.info.</p>
        </div>
        <div className="workbook-library">
          <div className="disabled-workbook" aria-disabled="true">
            <span>Exploring Identity & Beliefs</span>
            <p>Explore self-stories, belonging, language, and beliefs in motion.</p>
          </div>
          <div className="disabled-workbook" aria-disabled="true">
            <span>Processing My Emotions</span>
            <p>Make space for feelings, mixed signals, body clues, and gentle next steps.</p>
          </div>
          <div className="disabled-workbook" aria-disabled="true">
            <span>Exploring Boundaries</span>
            <p>Notice limits, access needs, honest yeses, and relationship care.</p>
          </div>
          <div className="disabled-workbook" aria-disabled="true">
            <span>My Getting-Started Toolkit</span>
            <p>Collect small tools that help you begin when tasks feel sticky or blocked.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
