import { Hono } from "hono"
import { Variables } from "../../index"
import { Game } from "game-logic"

const app = new Hono<{ Variables: Variables }>()

app.post("/setup-teams", async c => {
	const { team1, team2 } = await c.req.json()
	const game = new Game({ skipConstructor: true })

	game.setTeam(0, team1)
	game.setTeam(1, team2)

	const { totalSteps, eventHistory, firstStep } = game.startGame()

	return c.json({
		firstStep,
		totalSteps,
		eventHistory,
	})
})

export default app
