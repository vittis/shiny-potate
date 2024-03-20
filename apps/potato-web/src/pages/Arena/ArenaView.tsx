import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { useArenaQueries } from "@/services/features/Arena/useArenaQueries";
import { Button } from "@/components/ui/button";
import { useArenaMutation } from "@/services/features/Arena/useArenaMutation";
import { format } from "date-fns";
import { SandboxView } from "../Play/Views/Sandbox/SandboxView";
import { start } from "repl";

const ArenaView = () => {
	const user = useSupabaseUserStore(state => state.user);
	const { createArenaGame, win, startMatch } = useArenaMutation();
	const { arenaData, arenaIsLoading, hasGame, game } = useArenaQueries();

	const onClickCreateTeam = async () => {
		const payload = {
			board: [
				{
					equipments: [
						{
							id: "Q462",
							data: {
								name: "Training Armbands",
								tags: ["TRINKET", "RANGED", "PHYSICAL"],
								slots: ["TRINKET"],
								mods: [
									{
										type: "GRANT_BASE_STAT",
										payload: { stat: "ATTACK_DAMAGE", value: 15 },
										tier: "implicit",
									},
									{
										type: "GRANT_BASE_STAT",
										payload: { stat: "DAMAGE_REDUCTION", value: 5 },
										tier: 1,
									},
								],
								effects: [],
								tier: 1,
							},
						},
						{
							id: "GK50",
							data: {
								name: "Shortbow",
								tags: ["WEAPON", "RANGED", "PHYSICAL"],
								slots: ["MAIN_HAND"],
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: { name: "Disarming Shot", type: "ATTACK" },
										tier: "implicit",
									},
									{
										type: "GRANT_BASE_STAT",
										payload: { stat: "ATTACK_DAMAGE", value: 10 },
										tier: "implicit",
									},
									{ type: "GRANT_PERK", payload: { name: "Focused Mind", tier: 4 }, tier: 4 },
									{ type: "GRANT_PERK", payload: { name: "Berserk", tier: 3 }, tier: 3 },
								],
								effects: [],
								tier: 4,
							},
						},
					],
					position: 1,
					unitClass: "Ranger",
				},
				{
					equipments: [
						{
							id: "VV8v",
							data: {
								name: "Shortbow",
								tags: ["WEAPON", "RANGED", "PHYSICAL"],
								slots: ["MAIN_HAND"],
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: { name: "Disarming Shot", type: "ATTACK" },
										tier: "implicit",
									},
									{
										type: "GRANT_BASE_STAT",
										payload: { stat: "ATTACK_DAMAGE", value: 10 },
										tier: "implicit",
									},
									{
										type: "GRANT_BASE_STAT",
										payload: { stat: "SPELL_COOLDOWN", value: 5 },
										tier: 1,
									},
								],
								effects: [],
								tier: 1,
							},
						},
					],
					position: 0,
					unitClass: "Ranger",
				},
			],
			round: game.round,
			wins: game.wins,
			losses: game.losses,
		};
		await startMatch(payload);
	};
	const onClickCreateArena = async () => {
		await createArenaGame(user.id);
	};

	const onClickWin = async () => {
		await win(game);
	};
	return (
		<div className="flex flex-col h-full">
			{user && (
				<>
					{!hasGame && (
						<>
							<div className="flex w-full flex-wrap justify-center items-center px-2 py-2 h-screen">
								<div className="w-full flex justify-end mr-4">
									{" "}
									<Button> Instructions</Button>
								</div>
								<div className="text-center">
									<h1> Welcome to the arena</h1>
									<div className="flex w-full mt-4">
										<span className="mr-8"> Win all time: 0</span>
										<span> Defeats all time: 0</span>
									</div>
								</div>
								<div className="w-full flex justify-center mt-4">
									<Button onClick={onClickCreateArena}> New Run</Button>
								</div>
							</div>
						</>
					)}
					{hasGame && game && (
						<div>
							<div className="flex w-full justify-between py-4 px-4">
								<div> Gold: {game.gold} </div>
								<div>
									{" "}
									Wins: {game.wins} Losses: {game.losses}{" "}
								</div>
								<div> Started At: {format(game.created_at, "MM/dd/yy")} </div>
							</div>
							<SandboxView />
							<Button onClick={onClickCreateTeam}> Start Game</Button>
							<Button onClick={onClickWin}> Win Game</Button>
						</div>
					)}
				</>
			)}

			{!user && <h1 className="px-4 mt-2 text-muted-foreground">Sign in to start an arena</h1>}
		</div>
	);
};

export default ArenaView;
