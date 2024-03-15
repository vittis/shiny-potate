import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/services/supabase/supabase";
import { toast } from "react-toastify";
import { useSupabaseUserStore } from "@/services/features/User/useSupabaseUserStore";

const FormSchema = z.object({
	username: z.string().min(4, { message: "Name must be at least 4 characters" }).max(16, {
		message: "Username must not be longer than 16 characters.",
	}),
});

interface UserNameDrawer {
	hasUsername: boolean;
}

const UserNameDrawer = ({ hasUsername }: UserNameDrawer) => {
	const [isOpen, setIsOpen] = useState(hasUsername ? true : false);

	const user = useSupabaseUserStore(state => state.user);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: "",
		},
	});

	async function onSubmit(formData: z.infer<typeof FormSchema>) {
		const { data, error } = await supabase
			.from("profiles")
			.update({ username: formData.username })
			.eq("id", user.id)
			.select();
		if (error) {
			throw error;
		}

		setIsOpen(false);
		toast.success("Username created (:");
	}

	return (
		<Dialog open={isOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new username</DialogTitle>
					<DialogDescription>Fill the form with the necessary information</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder="username" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export { UserNameDrawer };
