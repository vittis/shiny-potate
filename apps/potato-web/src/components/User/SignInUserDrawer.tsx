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
import { Github } from "lucide-react";
import { useLocation } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Separator } from "../ui/separator";

const FormSchema = z.object({
	/* username: z.string().min(4, { message: "Name must be at least 4 characters" }).max(16, {
    message: "Username must not be longer than 16 characters.",
  }), */
	password: z.string().min(6, { message: "Password must have at least 6 characters" }),
	email: z
		.string()
		.min(1, { message: "This field has to be filled." })
		.email("This is not a valid email."),
});

interface SignInUserDrawerProps {}

const SignInUserDrawer = ({}: SignInUserDrawerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { pathname } = useLocation();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			/*  username: "", */
			password: "",
			email: "",
		},
	});

	async function signInWithGithub() {
		await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: `${window.origin}${pathname}`,
			},
		});
	}

	async function signInWithGoogle() {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.origin}${pathname}`,
			},
		});
	}

	async function onSubmit(formData: z.infer<typeof FormSchema>) {
		let { data, error } = await supabase.auth.signInWithPassword({
			email: formData.email,
			password: formData.password,
		});

		if (error) {
			throw error;
		}

		setIsOpen(false);
		// todo toast
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<Button onClick={() => setIsOpen(true)} type="button">
				Sign In
			</Button>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Sign In</DialogTitle>
				</DialogHeader>

				<div className="mt-4 flex w-full justify-center gap-4">
					<Button className="flex gap-2 px-8" variant="secondary" onClick={signInWithGithub}>
						<Github /> GitHub
					</Button>
					<Button className="flex gap-2 px-8" variant="secondary" onClick={signInWithGoogle}>
						<FaGoogle /> Google
					</Button>
				</div>

				<div className="mt-2 flex items-center gap-4">
					<Separator className="flex-1" />
					<div>or</div>
					<Separator className="flex-1" />
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="turbo@potato.co" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input placeholder="*******" type="password" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="submit">Sign In</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export { SignInUserDrawer };
