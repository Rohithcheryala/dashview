import "../App.css";

function Card({ name }) {
  return (
    <>
      <div className="bg-green-400 p-4">{name}</div>
    </>
  );
}

export default Card;
