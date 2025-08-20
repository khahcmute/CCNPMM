import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Profile from "./components/Profile";
import avt from "./assets/img/avt.jpg";
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <dir>
      <Member info={member.info} text={member.text}/>
    </dir>
  );
  
}

export default App;

const member = {
  text: "Sinh viên khoa CNTT - HCMUTE",
  info: {
    path: avt,
    name: "Trần Tuấn Kha",
    age: 21,
  },
};

function Member(props) {
  return (
    <div className="member">
      <MemberInfo memberInfo={props.info} />
      <Comment text={props.text} />
    </div>
  );
}

function Avatar(props) {
  return (
    <div className="avatar">
      <img src={props.avatar.path} alt="" />
    </div>
  );
}

function MemberInfo(props) {
  return (
    <div className="memberinfo">
      <Avatar avatar={props.memberInfo} />
      <h2>{props.memberInfo.name}</h2>
      <p>Tuổi: {props.memberInfo.age}</p>
    </div>
  );
}

function Comment(props) {
  return (
    <div className="comment">
      <p>{props.text}</p>
    </div>
  );
}
