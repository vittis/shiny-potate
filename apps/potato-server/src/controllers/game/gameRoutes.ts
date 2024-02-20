import { Hono } from "hono";
import { Variables } from "../../index";
import { Game } from "../../modules/game";
import { OWNER } from "../../modules/game/game/BoardManager";

const app = new Hono<{ Variables: Variables }>();

app.post("/setup-teams", async (c) => {
  const { team1, team2 } = await c.req.json();
  const game = new Game({ skipConstructor: true });

  game.setTeam(OWNER.TEAM_ONE, team1);
  game.setTeam(OWNER.TEAM_TWO, team2);

  const { totalSteps, eventHistory, firstStep } = game.startGame();

  return c.json({
    firstStep,
    totalSteps,
    eventHistory,
  });
});

export default app;
