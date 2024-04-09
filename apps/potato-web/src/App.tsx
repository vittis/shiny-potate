import { useMemo } from "react";
import { useGameState } from "./services/state/useGameState";
import { useQuery } from "@tanstack/react-query";
import { fetchBattleSetup, fetchVanillaBattleSetup } from "./game/scenes/battle/BattleScene";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import { Flag, Swords } from "lucide-react";

const isVanillaBattleSetup = import.meta.env.VITE_VANILLA_BATTLE_SETUP;

function App() {
	const { selectedEntity, isGamePaused, setSelectedEntity, setIsGamePaused } = useGameState();

	const { data } = useQuery({
		queryKey: ["game/battle/setup"],
		queryFn: isVanillaBattleSetup === "true" ? fetchVanillaBattleSetup : fetchBattleSetup,
		staleTime: Infinity,
	});

	const firstState = data?.firstStep;

	const teamOneUnits = useMemo<any[]>(() => {
		if (!firstState) return [];
		return firstState?.units.filter(unit => unit.owner === 0);
	}, [firstState]);

	const teamTwoUnits = useMemo<any[]>(() => {
		if (!firstState) return [];
		return firstState?.units.filter(unit => unit.owner === 1);
	}, [firstState]);

	const allUnits = useMemo<any[]>(() => {
		return [...teamOneUnits, ...teamTwoUnits];
	}, [teamOneUnits, teamTwoUnits]);

	return (
		<>
			<div className="fixed top-24 flex w-full justify-center">
				<Button
					variant="outline"
					onClick={() => {
						setIsGamePaused(!isGamePaused);
					}}
					className={cn("h-[48px] w-[180px]")}
				>
					{!isGamePaused ? "Stop" : "Start"}{" "}
					{isGamePaused ? (
						<Swords width={16} className="ml-2" fill="white" />
					) : (
						<Flag width={16} className="ml-2" fill="white" />
					)}
				</Button>
			</div>

			<div className="fixed bottom-10 flex w-full justify-center">
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
			</div>
		</>
	);
}

export default App;
