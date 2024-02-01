import type { Input } from "valibot"
import * as v from "valibot"

export const AuthSchema = v.object({
  email: v.string('Your email must be a string.', [
    v.minLength(1, 'Please enter your email.'),
    v.email('The email address is badly formatted.')
  ])
});
export type AuthForm = Input<typeof AuthSchema>
