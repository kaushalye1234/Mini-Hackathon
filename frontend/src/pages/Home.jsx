import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home-page">
      <div className="home-copy">
        <p className="eyebrow">Campus lost and found</p>
        <h1>CampusFind LK</h1>
        <p className="home-subtitle">
          Helping Sri Lankan university communities reconnect people with their lost belongings.
        </p>
        <p className="muted">
          University students can lose phones, laptops, wallets, ID cards and keys. CampusFind LK
          gives students one place to report lost belongings, search existing reports, and contact
          the owner directly when an item is found.
        </p>
        <div className="form-actions">
          <Link className="button" to="/lost-items/report">
            Report Lost Item
          </Link>
          <Link className="button button-secondary" to="/lost-items">
            Search Lost Items
          </Link>
        </div>
      </div>
      <div className="home-panel" aria-label="CampusFind workflow">
        <div className="workflow-step">Report Lost Item</div>
        <div className="workflow-step">Search Matching Posts</div>
        <div className="workflow-step">Message Owner</div>
        <div className="workflow-step">Resolve Item</div>
      </div>
    </section>
  );
};

export default Home;
