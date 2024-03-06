/* import React from "react"; */
import ReactDOM from "react-dom/client";
/* import App from "./App"; */
/* import Phaser from "phaser";
import { PHASER_CONFIG } from "./game/config";
import { Battle } from "./game/scenes/battle/BattleScene"; */
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/api/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import "./styles/global.css";
import { MainLayout, MainWrapper } from "./pages/MainLayout";
import "react-toastify/dist/ReactToastify.min.css";
import { Flip, ToastContainer } from "react-toastify";
import App from "./App";
import { PHASER_CONFIG } from "./game/config";
import { Battle } from "./game/scenes/battle/BattleScene";
import { Setup } from "./game/scenes/setup/SetupScene";
import { SetupView } from "./pages/Setup/SetupView";

import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root/RootLayout";
import PlayLayout from "./pages/Play/PlayLayout";
import LobbyView from "./pages/Play/Views/Lobby/LobbyView";
import { GameView } from "./pages/Game/GameView";
import ArenaView from "./pages/Play/Views/Arena/ArenaView";
import { ShopView } from "./pages/Setup/ShopView";
import ArenaView from "./pages/Play/Views/Arena/ArenaView";
/* import { Game } from "game-logic";

Game.prototype. */

/* export const game = new Phaser.Game(
  Object.assign(PHASER_CONFIG, {
    scene: [Battle, Setup],
  })
);

function onReady() {
  const canvas = document.querySelector("canvas");

  if (!canvas) return;

  canvas.classList.add("hidden");
}

game.events.on("ready", onReady); */

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: (
					<>
						<Navigate to="play" replace />
					</>
				),
			},
			{
				path: "play",
				element: <PlayLayout />,
				children: [
					{
						index: true,
						element: (
							<>
								<Navigate to="sandbox" replace />
							</>
						),
					},
					{ path: "rooms", element: <LobbyView /> },
					{ path: "arena", element: <ArenaView /> },
					{ path: "sandbox", element: <ShopView /> },
					{ path: "sandbox", element: <SetupView /> },
					{ path: "arena", element: <ArenaView /> },
				],
			},
			{
				path: "game",
				element: <GameView />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<ToastContainer
				toastClassName="border"
				theme="dark"
				containerId="B"
				position="top-center"
				transition={Flip}
				closeButton={false}
			/>
			<ToastContainer
				position="bottom-left"
				theme="dark"
				toastClassName="border"
				draggablePercent={30}
				stacked
				hideProgressBar={false}
			/>
			<RouterProvider router={router} />
			{/* <SetupView /> */}
			{/* <MainLayout /> */}
			{/* <App /> */}

			{/* <MainWrapper /> */}
		</ThemeProvider>
	</QueryClientProvider>,
);
