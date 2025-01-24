import Phaser from "phaser";
import { BattleUnit } from "./battleUnit/BattleUnit";
import { queryClient } from "../../../services/api/queryClient";
import { useGameState } from "../../../services/state/useGameState";
import { preloadBattle, setupBattle, setupVFXAnimations } from "./BattleSetup";
import { useSetupState } from "@/services/state/useSetupState";
import { api } from "@/services/api/http";
import { useGameControlsStore } from "@/services/features/Game/useGameControlsStore";
import { EVENT_TYPE, OWNER, PossibleEvent, StepEffects } from "game-logic";
import { loopStepEvents } from "./BattleSceneUtils";
import { viewBattle } from "@/services/features/Arena/useArenaQueries";

const isVanillaBattleSetup = import.meta.env.VITE_VANILLA_BATTLE_SETUP;

export type SubStepEvent = Omit<StepEvent, "step" | "subEvents"> & {
	sourceId?: string;
};

export interface StepEvent {
	actorId: string;
	type: EVENT_TYPE;
	payload?: any;
	step: number;
	trigger?: string;
	subEvents?: SubStepEvent[];
}

export async function viewGameFromId() {
	const gameFromLocalStorage = localStorage.getItem("gameIdHistory");

	if (gameFromLocalStorage) {
		return JSON.parse(gameFromLocalStorage);
	}
}

export async function fetchBattleSetup() {
	const gameFromLocalStorage = localStorage.getItem("game");

	if (gameFromLocalStorage) {
		return JSON.parse(gameFromLocalStorage);
	}

	const response = await fetch("http://localhost:8787/game/battle/setup");
	const data = await response.json();
	return data;
}

export async function fetchVanillaBattleSetup() {
	const response = await api.get("/game/setup-teams-vanilla");

	return response.data;
}

export class Battle extends Phaser.Scene {
	text: any;
	firstStep: any;
	totalSteps = -1;
	board!: Phaser.GameObjects.Container;
	tiles!: Phaser.GameObjects.Sprite[];
	units: BattleUnit[] = [];
	eventHistory: PossibleEvent[] = [];
	effectHistory: StepEffects[] = [];
	winner: OWNER | "DRAW" | "TIME_LIMIT" = "DRAW";
	timeEventsHistory: Phaser.Time.TimerEvent[] = [];
	static timeStarted: number;

	isGamePaused = true;
	isPlayingEventAnimation = false;
	isPausedWhenPlayingEventAnimation = false;
	shouldStartFromBeginning = true;

	constructor() {
		super("BattleScene");
	}

	preload() {
		preloadBattle(this);
	}

	fetchBattle() {
		// reset everything
		this.timeEventsHistory.forEach(event => {
			event.destroy();
		});
		this.timeEventsHistory = [];
		this.isGamePaused = true;
		this.isPlayingEventAnimation = false;

		const searchParams = new URLSearchParams(window.location.search);
		const gameId = searchParams.get("id");

		this.units.forEach(unit => {
			unit.destroy();
		});
		this.units = [];

		if (!gameId) {
			queryClient
				.fetchQuery({
					queryKey: ["game/battle/setup"],
					queryFn: isVanillaBattleSetup === "true" ? fetchVanillaBattleSetup : fetchBattleSetup,
					staleTime: Infinity,
				})
				.then(data => {
					this.firstStep = data.firstStep;
					this.totalSteps = data.totalSteps;
					this.eventHistory = data.eventHistory;
					this.effectHistory = data.effectHistory;
					this.winner = data.winner;
					this.initializeUnits(this.firstStep);
				});
		} else {
			queryClient
				.fetchQuery({
					queryKey: ["view", "battle", gameId],
					queryFn: () => viewBattle(gameId || ""),
					staleTime: Infinity,
				})
				.then(data => {
					this.firstStep = data.game.firstStep;
					this.totalSteps = data.game.totalSteps;
					this.eventHistory = data.game.eventHistory;
					this.effectHistory = data.game.effectHistory;
					this.winner = data.game.winner;
					this.initializeUnits(this.firstStep);
				});
		}
	}

	create() {
		setupVFXAnimations(this);

		/* this.text = this.add.text(150, 200, "karpov", {
			font: "16px Courier",
			color: "white",
		});
		this.text.setOrigin(0.5); */

		const { board, tiles } = setupBattle(this);
		this.board = board;
		this.tiles = tiles;
		// board.add(this.text);

		this.fetchBattle();

		useGameState.subscribe(
			state => state.isGameHidden,
			isGameHidden => {
				if (!isGameHidden) {
					const gameFromLocalStorage = localStorage.getItem("game");

					if (gameFromLocalStorage) {
						const game = JSON.parse(gameFromLocalStorage);
						this.firstStep = game.firstStep;
						this.totalSteps = game.totalSteps;
						this.eventHistory = game.eventHistory;
						this.effectHistory = game.effectHistory;
						this.winner = game.winner;
						this.initializeUnits(this.firstStep);
					}
				}
			},
		);

		// not being used rn
		useGameState.subscribe(
			state => state.selectedEntity,
			selectedEntity => {
				this.units.forEach(unit => {
					if (unit.id === selectedEntity) {
						unit.onSelected();
					} else {
						unit.onDeselected();
					}
				});
			},
		);

		// not being used?
		useSetupState.subscribe(
			state => state.shouldStartGame,
			shouldStartGame => {
				if (shouldStartGame) {
					const gameFromLocalStorage = localStorage.getItem("game");
					const data = JSON.parse(gameFromLocalStorage as string);

					queryClient.invalidateQueries({ queryKey: ["game/battle/setup"] });
					this.firstStep = data.firstStep;
					this.totalSteps = data.totalSteps;
					this.eventHistory = data.eventHistory;
					this.effectHistory = data.effectHistory;
					this.winner = data.winner;
					this.initializeUnits(this.firstStep);
				}
			},
		);

		useGameState.subscribe(
			state => state.isGamePaused,
			isGamePaused => {
				this.isGamePaused = isGamePaused;

				if (this.shouldStartFromBeginning) {
					console.log("START");

					this.initializeUnits(this.firstStep);
					this.startFromBeggining();
					return;
				}

				if (isGamePaused) {
					console.log("PAUSE");

					if (this.isPlayingEventAnimation) {
						this.pauseUnitsAnimations();
					} else {
						this.pauseTimeEvents();
					}
				} else {
					console.log("RESUME");

					if (this.isPlayingEventAnimation) {
						this.resumeUnitsAnimations();
					} else {
						this.resumeTimeEvents();
					}
				}
			},
		);

		useGameState.subscribe(
			state => state.shouldRestartGame,
			shouldRestartGame => {
				if (shouldRestartGame) {
					console.log("RESTART");

					this.initializeUnits(this.firstStep);
					this.isGamePaused = true;
					this.isPlayingEventAnimation = false;
					this.isPausedWhenPlayingEventAnimation = false;
					this.shouldStartFromBeginning = true;
				}
			},
		);
	}

	playEvents(step: number) {
		const eventsOnThisStep = this.eventHistory.filter(e => e.step === step);
		const effectsOnThisStep = this.effectHistory.find(e => e.step === step);

		this.isPlayingEventAnimation = true;
		this.pauseTimeEvents();

		let eventsForSubStep;
		const playSubStepEvents = subStep => {
			if (subStep === 0) {
				eventsForSubStep = eventsOnThisStep.filter(event => !event.subStep);
			} else {
				eventsForSubStep = eventsOnThisStep.filter(event => event?.subStep === subStep);
			}
			if (eventsForSubStep.length > 0) {
				loopStepEvents({
					scene: this,
					loopEvents: eventsForSubStep,
					effectsOnThisStep,
					subStep,
					onAllAnimationsEnd: () => {
						playSubStepEvents(subStep + 1); // Recursively call for the next subStep
					},
				});
			} else {
				this.resumeTimeEvents();
				this.isPlayingEventAnimation = false;
			}
		};

		playSubStepEvents(0); // Start the recursive process

		if (step === this.totalSteps) {
			this.gameOver();
		}
	}

	initializeUnits(firstFrame: any) {
		this.units.forEach(unit => {
			unit.destroy();
		});
		this.units = [];

		firstFrame.units.forEach((dataUnit: any) => {
			const unit = new BattleUnit(this, dataUnit);
			this.units.push(unit);
			this.board.add(unit);
		});
	}

	resumeUnitsAnimations() {
		this.getAliveUnits().forEach(unit => {
			unit.resumeAnimations();
		});
	}
	pauseUnitsAnimations() {
		this.getAliveUnits().forEach(unit => {
			unit.pauseAnimations();
		});
	}

	resumeTimeEvents() {
		this.isPlayingEventAnimation = false;
		this.getAliveUnits().forEach(unit => {
			unit.disablesManager.resumeDisableDuration();
			if (!unit.disablesManager.isStunned()) {
				unit.abilitiesManager.resumeAbilityCooldown();
			}
		});
		this.timeEventsHistory.forEach(event => {
			event.paused = false;
		});
	}
	pauseTimeEvents() {
		this.getAliveUnits().forEach(unit => {
			unit.abilitiesManager.pauseAbilityCooldown();
			unit.disablesManager.pauseDisableDuration();
		});
		this.timeEventsHistory.forEach(event => {
			event.paused = true;
		});
	}

	gameOver() {
		/* this.isGamePaused = true;

		this.isPlayingEventAnimation = false;

		this.pauseUnitsAnimations();
		this.pauseTimeEvents(); */

		useGameState.getState().setIsGameOver(true);

		console.log("GAME OVER: ", this.winner);
	}

	startFromBeggining() {
		Battle.timeStarted = this.time.now;
		// const stepsThatHaveEvents = [...new Set(this.eventHistory.map(event => event.step))];
		const stepsThatHaveEvents = [...new Set(this.effectHistory.map(event => event.step))];

		this.units.forEach(unit => {
			// todo initialize abilities?
			unit.onStart();
		});

		this.timeEventsHistory.forEach(event => {
			event.destroy();
		});
		this.timeEventsHistory = [];

		stepsThatHaveEvents.forEach(step => {
			const delay = step * useGameControlsStore.getState().stepTime;

			const timeEvent = this.time.addEvent({
				delay: delay,
				callback: () => {
					this.playEvents(step);
				},
				callbackScope: this,
			});

			this.timeEventsHistory.push(timeEvent);
		});
		console.log(stepsThatHaveEvents);
		console.log(this.timeEventsHistory);

		this.shouldStartFromBeginning = false;
	}

	update(/* time: number, delta: number */): void {
		/* if (this.units.length === 0) return;
		this.text.setText([
			`isGamePaused: ${this.isGamePaused}`,
			`isPlayingEventAnimation: ${this.isPlayingEventAnimation}`,
		]); */
	}

	getAliveUnits(): BattleUnit[] {
		return this.units.filter(unit => !unit.isDead);
	}
}
