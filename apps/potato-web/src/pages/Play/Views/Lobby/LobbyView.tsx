import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateRoomDrawer } from "./CreateRoomDrawer";
import SupaRoomsView from "./SupaRoomsView";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";

const LobbyView = () => {
	const user = useSupabaseUserStore(state => state.user);

	return (
		<div className="flex h-full flex-col">
			<div>
				<div className="breadcrumbs flex h-[52px] items-center px-4">
					<ul>
						<li>
							<h1 className="text-lg font-bold">Lobby</h1>
						</li>
						<li>
							<h2 className="text-md font-bold text-muted-foreground">Browse Rooms</h2>
						</li>
					</ul>
				</div>
			</div>

			<Separator />

			<form className="px-4 py-3">
				<div className="relative flex gap-4">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Search" className="pl-8" />
					<Tabs defaultValue="all" className="ml-auto">
						<TabsList>
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="open">Open</TabsTrigger>
							<TabsTrigger value="inProgress">In Progress</TabsTrigger>
						</TabsList>
					</Tabs>

					<CreateRoomDrawer />
				</div>
			</form>

			{user && <SupaRoomsView />}
			{!user && <h1 className="mt-2 px-4 text-muted-foreground">Sign in to browse rooms</h1>}
		</div>
	);
};

export default LobbyView;
