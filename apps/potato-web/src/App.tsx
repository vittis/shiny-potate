import { useMemo } from "react";
import { useGameState } from "./services/state/useGameState";
import { useQuery } from "@tanstack/react-query";
import { fetchBattleSetup, fetchVanillaBattleSetup } from "./game/scenes/battle/BattleScene";
import { Pause, Play, RotateCcw, Swords } from "lucide-react";
import { CrazyButton } from "./pages/Play/Views/Arena/ArenaActionButtons";

const isVanillaBattleSetup = import.meta.env.VITE_VANILLA_BATTLE_SETUP;

function App() {
	const { isGamePaused, setIsGamePaused, isGameOver, restartGame, hasGameStarted } = useGameState();

	return (
		<>
			<div className="fixed top-24 flex w-full justify-center gap-8">
				{!isGameOver && (
					<CrazyButton
						onClick={() => {
							setIsGamePaused(!isGamePaused);
						}}
					>
						<span className="align-center flex justify-center">
							{!hasGameStarted ? "Start" : isGamePaused ? "Resume" : "Pause"}{" "}
							{!hasGameStarted ? (
								<Swords width={16} className="ml-2" fill="white" />
							) : isGamePaused ? (
								<Play width={16} className="ml-2" fill="white" />
							) : (
								<Pause width={16} className="ml-2" fill="white" />
							)}
						</span>
					</CrazyButton>
				)}

				{(isGameOver || (hasGameStarted && isGamePaused)) && (
					<CrazyButton
						onClick={() => {
							restartGame();
						}}
					>
						<span className="align-center flex justify-center">
							{"Restart "}
							<RotateCcw width={16} className="ml-2" />
						</span>
					</CrazyButton>
				)}
			</div>

			{/* <div className="fixed bottom-10 flex w-full justify-center">
				<div
					tabIndex={0}
					className="collapse collapse-plus absolute bottom-2 left-2 ml-auto mr-auto w-fit bg-stone-800"
				>
					<input type="checkbox" />
					<div className="collapse-title text-center text-xl font-medium text-white">
						Show Units
					</div>
					<div className="collapse-content">
						{firstState && (
							<div className="inset-x-0 mx-auto flex w-fit justify-center rounded-lg bg-stone-800 p-4 shadow-md">
								<div className="overflow-x-auto">
									<table className="table table-xs">
										<thead>
											<tr className="text-md uppercase italic text-zinc-100">
												<th>Name</th>
												<th>Hp</th>
												<th>Shield</th>
												<th>Atk Cd</th>
												<th>Atk Dmg</th>
												<th>Spell Cd</th>
												<th>Spell Dmg</th>
												<th>Dmg Reduction</th>
											</tr>
										</thead>
										<tbody className="text-zinc-100">
											{allUnits.map((unit: any) => {
												return (
													<tr
														// @todo add an ID
														onClick={() => {
															if (selectedEntity !== `${unit.owner}${unit.position}`) {
																setSelectedEntity(`${unit.owner}${unit.position}`);
															} else {
																setSelectedEntity(null);
															}
														}}
														tabIndex={0}
														className={`cursor-pointer border-none transition-all hover:brightness-125 ${
															selectedEntity === `${unit.owner}${unit.position}`
																? "bg-amber-400 text-zinc-900"
																: `${unit.owner === 0 ? "bg-amber-950" : "bg-slate-800"}`
														}`}
														key={`${unit.owner}${unit.position}`}
													>
														<td>{unit.name}</td>
														<td>{unit.stats.hp}</td>
														<td>{unit.stats.shield}</td>
														<td>{unit.stats.attackCooldownModifier * -1}%</td>
														<td>{unit.stats.attackDamageModifier}%</td>
														<td>{unit.stats.spellCooldownModifier * -1}%</td>
														<td>{unit.stats.spellDamageModifier}%</td>
														<td>{unit.stats.damageReductionModifier}%</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
				</div>
			</div> */}
		</>
	);
}

export default App;
