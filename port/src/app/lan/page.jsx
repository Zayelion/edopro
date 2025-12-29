"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function LanPage() {
	const router = useRouter();
	const [nickname, setNickname] = useState("Zayelion");
	const [hostAddress, setHostAddress] = useState("127.0.0.1");
	const [hostPort, setHostPort] = useState("7911");
	const [password, setPassword] = useState("");
	const [matches, setMatches] = useState([]);

	const hasManualPassword = useMemo(
		() => password.trim().length > 0,
		[password]
	);

	const handleRefresh = () => {
		setMatches([]);
	};

	const handleHost = () => {
		window.location.href = "/host";
	};

	const handleJoin = () => {
		if (!hasManualPassword) {
			return;
		}
		console.log("Join manual room", {
			hostAddress,
			hostPort,
			password,
			nickname,
		});
	};

	return (
		<div className="app-shell">
			<section className="lan-panel">
				<header className="lan-header">LAN + AI</header>
				<div className="lan-row">
					<label className="lan-label" htmlFor="nickname">
						Nickname:
					</label>
					<input
						id="nickname"
						className="lan-input"
						value={nickname}
						onChange={(event) => setNickname(event.target.value)}
					/>
					<button className="menu-button" type="button" onClick={handleHost}>
						Host
					</button>
				</div>

				<div className="lan-list">
					{matches.length === 0 ? (
						<div className="lan-empty">No games detected on your network.</div>
					) : (
						matches.map((match, index) => (
							<div key={`${match.id ?? index}`} className="lan-item">
								{match.name}
							</div>
						))
					)}
				</div>

				<div className="lan-refresh">
					<button className="menu-button" type="button" onClick={handleRefresh}>
						Refresh
					</button>
				</div>

				<div className="lan-manual">
					<div className="lan-row">
						<label className="lan-label" htmlFor="host-address">
							Host Address:
						</label>
						<input
							id="host-address"
							className="lan-input"
							value={hostAddress}
							onChange={(event) => setHostAddress(event.target.value)}
						/>
						<input
							id="host-port"
							className="lan-input lan-port"
							value={hostPort}
							onChange={(event) => setHostPort(event.target.value)}
						/>
						<button
							className="menu-button"
							type="button"
							onClick={handleJoin}
							disabled={!hasManualPassword}
						>
							Join
						</button>
					</div>
					<div className="lan-row">
						<label className="lan-label" htmlFor="password">
							Password:
						</label>
						<input
							id="password"
							className="lan-input"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							type="password"
							placeholder="Required"
						/>
						<button
							className="menu-button exit"
							type="button"
							onClick={() => router.push("/")}
						>
							Cancel
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
