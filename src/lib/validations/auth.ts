import type { Input } from "valibot";
import * as v from "valibot";

export const AuthSchema = v.object({
	email: v.string("Your email must be a string.", [
		v.minLength(1, "Please enter your email."),
		v.email("The email address is badly formatted."),
	]),
	password: v.string("Your password must be a string.", [
		v.minLength(8, "Your password must be 8 characters."),
	]),
});
export type AuthForm = Input<typeof AuthSchema>;
