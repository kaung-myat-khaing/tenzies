import React from "react";
import Die from "./components/Die";
import useWindowSize from "react-use/lib/useWindowSize";
import "./css/App.css";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
export default function App() {
	const { width, height } = useWindowSize();
	const [tenzies, setTenzies] = React.useState(false);
	let [time, setTime] = React.useState(0);
	let [playing, setPlaying] = React.useState(false);
	let [rollCount, setRollCount] = React.useState(0);
	const [dice, setDice] = React.useState(allNewDice());
	// let timeHandle;
	function generatenewDie() {
		return {
			value: Math.floor(Math.random() * 6 - 1 + 1) + 1,
			isHeld: false,
			id: nanoid(),
		};
	}
	function allNewDice() {
		const diceArray = [];
		for (let i = 0; i < 10; i++) {
			diceArray.push(generatenewDie());
		}
		return diceArray;
	}
	function holdDie(id) {
		setDice((prevDice) =>
			prevDice.map((die) => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
			})
		);
	}
	let diceElements = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			holdDie={() => holdDie(die.id)}
		/>
	));
	function createUnknownDice() {
		function createArray(numberOfElements) {
			let arr = [];
			for (let i = 0; i < numberOfElements; i++) {
				arr.push(i);
			}
			return arr;
		}
		return createArray(10).map(() => <div className="unknown die">?</div>);
	}
	function resetStates() {
		setPlaying(false);
		setTime(0);
		setRollCount(0);
		// window.clearInterval(timeHandle);
	}
	function roll() {
		setDice((prevDice) =>
			prevDice.map((die) => {
				return die.isHeld ? die : generatenewDie();
			})
		);
		setRollCount((prevRollCount) => prevRollCount + 1);
	}
	// RESET FOR NEW GAME
	function newGame() {
		setTenzies(false);
		setDice(allNewDice());
		resetStates();
	}
	function saveBestScores() {
		if (localStorage.getItem("time") && localStorage.getItem("rolls")) {
			if (time < localStorage.getItem("time"))
				localStorage.setItem("time", time);
			if (rollCount < localStorage.getItem("rolls"))
				localStorage.setItem("rolls", rollCount);
		} else {
			localStorage.setItem("time", time);
			localStorage.setItem("rolls", rollCount);
		}
	}
	function timeFormatter(time) {
		let min = Math.floor(time / 60);
		let sec = time <= 59 ? time : time - 60 * min;
		let timeString = `${min < 10 ? `0${min}` : min}:${
			sec < 10 ? `0${sec}` : sec
		}`;
		return timeString;
	}
	React.useEffect(() => {
		let firstDie = dice[0].value;
		let heldCount = 0,
			sameValCount = 0;
		dice.forEach((die) => {
			if (die.isHeld) heldCount++;
			if (die.value === firstDie) sameValCount++;
		});
		// WIN CONDITION
		if (heldCount === 10 && sameValCount === 10) {
			setTenzies(true);
			saveBestScores();
			resetStates();
		}
	}, [dice]);
	// EXTRA CREDITS
	React.useEffect(() => {
		let timeHandle = null;
		if (playing) {
			timeHandle = window.setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000);
		} else {
			console.log("else ran");
			clearInterval(timeHandle);
		}
		return () => {
			console.log("cleanup ran");
			clearInterval(timeHandle);
		};
	}, [playing]);

	function startGame() {
		resetStates();
		setPlaying(true);
	}

	return (
		<>
			{tenzies && <Confetti width={width} height={height} />}
			<div className="game">
				<div className="records">
					<div className="current-record">
						<h1 className="current-record--heading">Current</h1>
						<div className="time-record">⏱ {timeFormatter(time)}</div>
						<div className="roll-record">🎲 🔄 {rollCount}</div>
					</div>

					<div className="best-record">
						<h1 className="best-record--heading">Best</h1>
						<div className="time-record--best">
							⏱{" "}
							{localStorage.getItem("time")
								? timeFormatter(localStorage.getItem("time"))
								: "not set"}
						</div>
						<div className="roll-record--best">
							🎲 🔄{" "}
							{localStorage.getItem("rolls")
								? localStorage.getItem("rolls")
								: "not set"}
						</div>
					</div>
				</div>

				<main>
					<h1>Tenzies</h1>
					<p className="how-to-play">
						Roll until all dice are the same. Click each die to freeze it at its
						current value between rolls.
					</p>
					<div className="die-plane">
						{playing ? diceElements : createUnknownDice()}
					</div>
					{!tenzies && !playing && (
						<button type="button" className="roll-dice" onClick={startGame}>
							Start game
						</button>
					)}
					{!tenzies && playing && (
						<button type="button" className="roll-dice" onClick={roll}>
							Roll
						</button>
					)}
					{tenzies && !playing && (
						<button type="button" className="new-game" onClick={newGame}>
							New Game
						</button>
					)}
				</main>
			</div>
		</>
	);
}
