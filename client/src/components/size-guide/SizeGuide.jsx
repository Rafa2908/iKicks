import PropTypes from "prop-types";
import "./SizeGuide.css";
import { useEffect } from "react";

const mensizes = [
  { us: "6", eu: "38", uk: "5.5", cm: "23.5" },
  { us: "6.5", eu: "39", uk: "6", cm: "24" },
  { us: "7", eu: "39", uk: "6.5", cm: "24.5" },
  { us: "7.5", eu: "40", uk: "7", cm: "25" },
  { us: "8", eu: "41", uk: "7.5", cm: "25.5" },
  { us: "8.5", eu: "41", uk: "8", cm: "26" },
  { us: "9", eu: "42", uk: "8.5", cm: "26.5" },
  { us: "9.5", eu: "43", uk: "9", cm: "27" },
  { us: "10", eu: "44", uk: "9.5", cm: "27.5" },
  { us: "10.5", eu: "44", uk: "10", cm: "28" },
  { us: "11", eu: "45", uk: "10.5", cm: "28.5" },
  { us: "11.5", eu: "46", uk: "11", cm: "29" },
  { us: "12", eu: "46", uk: "11.5", cm: "29.5" },
  { us: "13", eu: "47", uk: "12", cm: "30.5" },
];

const womensizes = [
  { us: "5", eu: "35", uk: "2.5", cm: "21.5" },
  { us: "5.5", eu: "36", uk: "3", cm: "22" },
  { us: "6", eu: "36", uk: "3.5", cm: "22.5" },
  { us: "6.5", eu: "37", uk: "4", cm: "23" },
  { us: "7", eu: "37", uk: "4.5", cm: "23.5" },
  { us: "7.5", eu: "38", uk: "5", cm: "24" },
  { us: "8", eu: "38", uk: "5.5", cm: "24.5" },
  { us: "8.5", eu: "39", uk: "6", cm: "25" },
  { us: "9", eu: "40", uk: "6.5", cm: "25.5" },
  { us: "9.5", eu: "40", uk: "7", cm: "26" },
  { us: "10", eu: "41", uk: "7.5", cm: "26.5" },
  { us: "11", eu: "42", uk: "8.5", cm: "27.5" },
];

const SizeTable = ({ rows }) => (
  <table className="sg-table">
    <thead>
      <tr>
        <th>US</th>
        <th>EU</th>
        <th>UK</th>
        <th>CM</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((r) => (
        <tr key={`${r.us}-${r.eu}`}>
          <td>{r.us}</td>
          <td>{r.eu}</td>
          <td>{r.uk}</td>
          <td>{r.cm}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

SizeTable.propTypes = { rows: PropTypes.arrayOf(PropTypes.object).isRequired };

const SizeGuide = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="sg-hero">
        <h1 className="sg-hero-title">Size Guide</h1>
        <p className="sg-hero-sub">Find your perfect fit.</p>
      </div>

      <div className="sg-content">
        <div className="sg-tip">
          <i className="fa-solid fa-circle-info" />
          <p>
            Sizes vary between brands. If you&apos;re between sizes, we
            recommend sizing up. All measurements are approximate.
          </p>
        </div>

        <div className="sg-how">
          <h2 className="sg-section-title">How to Measure Your Foot</h2>
          <ol className="sg-steps">
            <li>
              Place a blank sheet of paper on a hard floor and stand on it.
            </li>
            <li>
              Trace the outline of your foot with a pencil held vertically.
            </li>
            <li>
              Measure the longest distance from heel to toe in centimeters.
            </li>
            <li>Use the CM column in the table below to find your size.</li>
          </ol>
        </div>

        <div className="sg-tables">
          <div className="sg-table-block">
            <h2 className="sg-section-title">Men&apos;s Sizes</h2>
            <div className="sg-table-wrap">
              <SizeTable rows={mensizes} />
            </div>
          </div>

          <div className="sg-table-block">
            <h2 className="sg-section-title">Women&apos;s Sizes</h2>
            <div className="sg-table-wrap">
              <SizeTable rows={womensizes} />
            </div>
          </div>
        </div>

        <div className="sg-note">
          <p>
            Still unsure about your size?{" "}
            <a href="/contact" className="sg-link">
              Contact us
            </a>{" "}
            and we&apos;ll help you find the right fit.
          </p>
        </div>
      </div>
    </>
  );
};

export default SizeGuide;
