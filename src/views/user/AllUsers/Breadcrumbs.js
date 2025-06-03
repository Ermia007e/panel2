import { Link } from "react-router-dom"

const Breadcrumbs = ({ title, data = [] }) => (
  <nav style={{ margin: "24px 0" }}>
    <ol style={{ listStyle: "none", display: "flex", flexWrap: "wrap", padding: 0, margin: 0 }}>
      {data.map((item, idx) => (
        <li key={idx} style={{ display: "flex", alignItems: "center" }}>
          {item.link && idx !== data.length - 1 ? (
            <Link to={item.link} style={{ color: "#7367f0", textDecoration: "underline", fontWeight: 500 }}>{item.title}</Link>
          ) : (
            <span style={{ color: "#ffd666", fontWeight: 700 }}>{item.title}</span>
          )}
          {idx < data.length - 1 && <span style={{ margin: "0 8px", color: "#888" }}>/</span>}
        </li>
      ))}
    </ol>
    {title && <h2 style={{ fontWeight: 900, marginTop: 8, color: "#7367f0", fontSize: 22 }}>{title}</h2>}
  </nav>
)

export default Breadcrumbs