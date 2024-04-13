import { Nav } from "@/components/Nav/Nav";
import { trpc } from "@/services/api/trpc";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { supabase } from "@/services/supabase/supabase";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
	const setUser = useSupabaseUserStore(state => state.setUser);

	const utils = trpc.useUtils();

	useEffect(() => {
		// todo put this somewhere else
		supabase.auth.onAuthStateChange((event, session) => {
			console.log("onAuthStateChange: ", event);

			if (event === "SIGNED_OUT") {
				setUser(null);
			}

			if (session && session.user) {
				setUser(session.user);
			}

			utils.arena.invalidate(); // todo better way to refresh everything
		});
	}, []);

	return (
		<>
			<div className="fixed -z-50 h-full w-full" />
			<div className="relative h-full p-1 md:p-4">
				<section className="flex h-full flex-col">
					<Nav />
					<Outlet />
				</section>
			</div>
		</>
	);
};

export default RootLayout;
