export default function name(props) {
  return (
    <div className="member">
      <img src={props.avatar} alt="" />
      <h2>{props.name}</h2>
      <p>Tuổi: {props.age}</p>
      <p>{props.comment}</p>
    </div>
  );
}
