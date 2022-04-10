import React, { useState } from 'react';
import { AlertCircle, Check, HelpCircle } from 'react-feather';
import './App.css';

function PlacebotLinks() {
	return (
		<p>
			<a
				className="App-link"
				href="https://github.com/thatretrodev/placebot"
				target="_blank"
				rel="noopener noreferrer"
			>
				Placebot repository
			</a>
			{' | '}
			<a
				className="App-link"
				href="https://github.com/thatretrodev/placebot-web"
				target="_blank"
				rel="noopener noreferrer"
			>
				Placebot-web repository
			</a>
		</p>
	);
}

let interval_set = false;

function App() {
	const [configured, setConfigured] = useState<any>(null);
	const [task, setTask] = useState("Loading...");

	if (!interval_set) {
		setInterval((async () => {
			let response = await fetch("http://localhost:4000/api/status");
	
			let data = await response.json();
	
			if (data.configured == true) {
				setTask(`Building ${data.image} at x: ${data.x}, y: ${data.y}`);
				setConfigured(true);
			}
			else {
				setConfigured(false);
			}
		}), 1000);
	}

	if (configured == null) {
		return (
			<div className="App">
				<header className="App-header">
					<HelpCircle size={100} color="#aaaaaa" />
					<p>Loading status...</p>
					<PlacebotLinks />
				</header>
			</div>
		);
	}

	return configured ? (
		<div className="App">
			<header className="App-header">
				<Check size={100} color="#00aa00" />
				<p>Placebot is configured.</p>
				<p>Current bot task: {task}</p>
				<PlacebotLinks />
			</header>
		</div>
	) : (
		<div className="App">
			<header className="App-header">
				<AlertCircle size={100} color="#aa0000" />
				<p>Placebot is not configured.</p>
				<PlacebotLinks />
			</header>
		</div>
	);
}

export default App;
