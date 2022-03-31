import React from "react";
import "../css/Die.css";
export default function Die(props) {
	const style = { backgroundColor: props.isHeld ? "#59E391" : "#FFFFFF" };
	return (
		<div className="die" role="button" style={style} onClick={props.holdDie}>
			{props.value}
		</div>
	);
}
