import { Nav } from "@/components/Nav/Nav";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";
import { supabase } from "@/services/supabase/supabase";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
	const setUser = useSupabaseUserStore(state => state.setUser);

	useEffect(() => {
		supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_OUT") {
				setUser(null);
			}
			if (session && session.user) {
				setUser(session.user);
			}
		});
	}, []);

	return (
		<div className="relative h-full p-1 md:p-4">
			<section className="flex flex-col h-full">
				<Nav />
				<Outlet />
			</section>
		</div>
	);
};

export default RootLayout;
