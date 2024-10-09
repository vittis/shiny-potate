import { Shop, Storage, Board } from "game-logic";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			arena: {
				Row: {
					board: Board;
					created_at: string;
					gold: number;
					id: string;
					losses: number;
					player_id: string;
					round: number;
					shop: Shop;
					storage: Storage;
					updated_at: string;
					wins: number;
					xp: number;
				};
				Insert: {
					board: Board;
					created_at?: string;
					gold?: number;
					id?: string;
					losses?: number;
					player_id: string;
					round?: number;
					shop: Shop;
					storage: Storage;
					updated_at?: string;
					wins?: number;
					xp?: number;
				};
				Update: {
					board?: Board;
					created_at?: string;
					gold?: number;
					id?: string;
					losses?: number;
					player_id?: string;
					round?: number;
					shop?: Shop;
					storage?: Storage;
					updated_at?: string;
					wins?: number;
					xp?: number;
				};
				Relationships: [
					{
						foreignKeyName: "public_arena_player_id_fkey";
						columns: ["player_id"];
						isOneToOne: true;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			board: {
				Row: {
					board: Board;
					created_at: string;
					id: string;
					losses: number;
					player_id: string;
					round: number;
					wins: number;
				};
				Insert: {
					board: Board;
					created_at?: string;
					id?: string;
					losses?: number;
					player_id: string;
					round?: number;
					wins?: number;
				};
				Update: {
					board?: Board;
					created_at?: string;
					id?: string;
					losses?: number;
					player_id?: string;
					round?: number;
					wins?: number;
				};
				Relationships: [
					{
						foreignKeyName: "public_board_player_id_fkey";
						columns: ["player_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			games_history: {
				Row: {
					board_id: string;
					created_at: string;
					id: string;
					opponent_board_id: string;
					opponent_id: string;
					player_id: string;
					winner_id: string;
				};
				Insert: {
					board_id: string;
					created_at?: string;
					id?: string;
					opponent_board_id: string;
					opponent_id: string;
					player_id: string;
					winner_id: string;
				};
				Update: {
					board_id?: string;
					created_at?: string;
					id?: string;
					opponent_board_id?: string;
					opponent_id?: string;
					player_id?: string;
					winner_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "public_game_history_board_id_fkey";
						columns: ["board_id"];
						isOneToOne: false;
						referencedRelation: "board";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "public_game_history_opponent_board_id_fkey";
						columns: ["opponent_board_id"];
						isOneToOne: false;
						referencedRelation: "board";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "public_game_history_winner_id_fkey";
						columns: ["winner_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "public_games_history_opponent_id_fkey";
						columns: ["opponent_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "public_games_history_player_id_fkey";
						columns: ["player_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "public_games_history_winner_id_fkey";
						columns: ["winner_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			profiles: {
				Row: {
					id: string;
					username: string | null;
				};
				Insert: {
					id: string;
					username?: string | null;
				};
				Update: {
					id?: string;
					username?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "profiles_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			room_members: {
				Row: {
					is_creator: boolean;
					joined_at: string | null;
					room_id: string;
					user_id: string;
				};
				Insert: {
					is_creator?: boolean;
					joined_at?: string | null;
					room_id: string;
					user_id: string;
				};
				Update: {
					is_creator?: boolean;
					joined_at?: string | null;
					room_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "public_room_members_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "room_members_room_id_fkey";
						columns: ["room_id"];
						isOneToOne: false;
						referencedRelation: "rooms";
						referencedColumns: ["id"];
					},
				];
			};
			rooms: {
				Row: {
					capacity: number;
					created_at: string;
					description: string | null;
					id: string;
					last_updated: string;
					name: string;
				};
				Insert: {
					capacity: number;
					created_at?: string;
					description?: string | null;
					id?: string;
					last_updated?: string;
					name: string;
				};
				Update: {
					capacity?: number;
					created_at?: string;
					description?: string | null;
					id?: string;
					last_updated?: string;
					name?: string;
				};
				Relationships: [];
			};
			teams: {
				Row: {
					board: Board;
					created_at: string;
					id: number;
					losses: number | null;
					player_id: string;
					round: number | null;
					wins: number | null;
				};
				Insert: {
					board: Board;
					created_at?: string;
					id?: number;
					losses?: number | null;
					player_id?: string;
					round?: number | null;
					wins?: number | null;
				};
				Update: {
					board?: Board;
					created_at?: string;
					id?: number;
					losses?: number | null;
					player_id?: string;
					round?: number | null;
					wins?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "public_teams_player_id_fkey";
						columns: ["player_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;
