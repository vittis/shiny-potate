import Phaser from "phaser";
import { BattleUnit } from "./battleUnit/BattleUnit";
import { queryClient } from "../../../services/api/queryClient";
import { useGameState } from "../../../services/state/useGameState";
import { preloadBattle, setupBattle, setupVFXAnimations } from "./BattleSetup";
import { Ability, highlightAbility, restoreAbilities } from "./battleUnit/BattleUnitAbilities";
import { useSetupState } from "@/services/state/useSetupState";
import { api } from "@/services/api/http";
import { useGameControlsStore } from "@/services/features/Game/useGameControlsStore";
import { EVENT_TYPE, PossibleEvent, StepEffects } from "game-logic";
import { trpc } from "@/services/api/trpc";
import { viewBattle } from "@/pages/Game/GameView";

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
	timeEventsHistory: Phaser.Time.TimerEvent[] = [];
	static timeStarted: number;

	isGamePaused = true;
	isPlayingEventAnimation = false;

	constructor() {
		super("BattleScene");
	}

	preload() {
		preloadBattle(this);
	}

	create() {
		setupVFXAnimations(this);

		/* const slash = this.add.sprite(400, 400, "slash2");
		slash.setDepth(1);
		slash.play("slash2_attack").on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
			slash.destroy();
		}); */

		this.text = this.add.text(150, 200, "karpov", {
			font: "16px Courier",
			color: "white",
		});
		this.text.setOrigin(0.5);

		const { board, tiles } = setupBattle(this);
		this.board = board;
		this.tiles = tiles;
		// board.add(this.text);

		const searchParams = new URLSearchParams(window.location.search);
		const gameId = searchParams.get("id");
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
					this.firstStep = data.firstStep;
					this.totalSteps = data.totalSteps;
					this.eventHistory = data.eventHistory;
					this.effectHistory = data.effectHistory;
					this.initializeUnits(this.firstStep);
				});
		}

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
						this.initializeUnits(this.firstStep);
					}
				}
			},
		);

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
					this.initializeUnits(this.firstStep);
				}
			},
		);

		useGameState.subscribe(
			state => state.isGamePaused,
			isGamePaused => {
				console.log("ON CLICK START", isGamePaused);
				this.isGamePaused = isGamePaused;

				if (isGamePaused) {
					if (this.isPlayingEventAnimation) {
						this.pauseUnitsAnimations();
					} else {
						this.pauseTimeEvents();
					}
					return;
				}

				if (this.shouldStartFromBeginning()) {
					this.initializeUnits(this.firstStep);
					this.startFromBeggining();
					return;
				}

				if (this.isPlayingEventAnimation) {
					this.resumeUnitsAnimations();
					return;
				}
				this.resumeTimeEvents();
			},
		);
	}

	playEvents(step: number) {
		const eventsOnThisStep = this.eventHistory.filter(e => e.step === step);
		const effectsOnThisStep = this.effectHistory.find(e => e.step === step);

		this.isPlayingEventAnimation = true;
		this.pauseTimeEvents();
		let animationsEnded = 0;
		let impactsEnded = 0;

		const eventsWithoutSubsteps = eventsOnThisStep.filter(event => !event.subStep);

		eventsWithoutSubsteps.forEach(event => {
			const unit = this.units.find(u => u.id === event.actorId);
			if (unit) {
				let targets;
				if (event.type === EVENT_TYPE.USE_ABILITY) {
					targets = this.units.filter(u => event.payload.targetsId.includes(u.id));
				}
				if (event.type === EVENT_TYPE.TRIGGER_EFFECT) {
					targets = [unit];
				}
				unit.playEvent({
					board: this.board,
					event: event as any,
					targets,
					onImpact: () => {
						impactsEnded++;
						if (impactsEnded === eventsWithoutSubsteps.length) {
							effectsOnThisStep?.units.forEach(unitEffect => {
								const currentUnit = this.units.find(u => u.id === unitEffect.unitId);
								unitEffect.effects.forEach(effect => {
									currentUnit?.applyEffect(effect);
								});
							});
						}
					},
					onEnd: () => {
						animationsEnded++;
						if (animationsEnded === eventsWithoutSubsteps.length) {
							this.resumeTimeEvents();
						}

						if (event.type === EVENT_TYPE.USE_ABILITY) {
							const abilityUsed = unit?.abilitiesManager.abilities.find(
								ability => ability.id === event.payload.id,
							) as Ability;
							restoreAbilities([abilityUsed], this);
						}
					},
					onStart: () => {
						if (event.type === EVENT_TYPE.USE_ABILITY) {
							const abilityUsed = unit?.abilitiesManager.abilities.find(
								ability => ability.id === event.payload.id,
							) as Ability;
							highlightAbility(abilityUsed, this);
						}
					},
					allUnits: this.units,
					step,
				});
			}
		});
	}

	shouldStartFromBeginning() {
		const lastTimeEventIndex = this.timeEventsHistory.length - 1;
		return (
			this.timeEventsHistory.length === 0 ||
			this.timeEventsHistory[lastTimeEventIndex].getRemaining() <= 0
		);
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
		this.units.forEach(unit => {
			unit.resumeAnimations();
		});
	}
	pauseUnitsAnimations() {
		this.units.forEach(unit => {
			unit.pauseAnimations();
		});
	}
	resumeTimeEvents() {
		this.isPlayingEventAnimation = false;
		this.units.forEach(unit => {
			unit.disablesManager.resumeDisableDuration();
			if (!unit.disablesManager.isStunned()) {
				unit.abilitiesManager.resumeSkillCooldown();
			}
		});
		this.timeEventsHistory.forEach(event => {
			event.paused = false;
		});
	}
	pauseTimeEvents() {
		this.units.forEach(unit => {
			unit.abilitiesManager.pauseSkillCooldown();
			unit.disablesManager.pauseDisableDuration();
		});
		this.timeEventsHistory.forEach(event => {
			event.paused = true;
		});
	}

	startFromBeggining() {
		Battle.timeStarted = this.time.now;
		// const stepsThatHaveEvents = [...new Set(this.eventHistory.map(event => event.step))];
		const stepsThatHaveEvents = [...new Set(this.effectHistory.map(event => event.step))];

		this.units.forEach(unit => {
			// todo initialize abilities?
			unit.onStart();
		});

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
	}

	update(/* time: number, delta: number */): void {
		if (this.units.length === 0) return;
		this.text.setText([
			`isGamePaused: ${this.isGamePaused}`,
			`isPlayingEventAnimation: ${this.isPlayingEventAnimation}`,
		]);
	}
}
