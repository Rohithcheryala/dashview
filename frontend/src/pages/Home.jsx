import { Link } from "react-router-dom";
import Card from "../components/Card";

function HomePage() {
  const dashboardData = [
    { name: "Dashbord-1" },
    { name: "Dashbord-2" },
    { name: "Dashbord-3" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2">
      {dashboardData.map((dd, index) => (
        <Link key={index} to={`/dashboard/${dd.name.toLowerCase()}`}>
          <Card name={dd.name} />
        </Link>
      ))}
    </div>
  );
}

export default HomePage;
