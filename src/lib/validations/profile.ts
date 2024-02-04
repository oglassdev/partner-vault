import type { Input } from "valibot"
import * as v from "valibot"

export const ProfileSchema = v.object({
  display_name: v.string('Your username must be a string.', [
    v.minLength(2, 'Your username must contain at least 2 characters.'),
  ]),
  username: v.string('Your username must be a string.', [
      v.minLength(2, 'Your username must contain at least 2 characters.'),
      v.regex(/^[a-zA-Z0-9_]+$/, 'Your username can only contain letters, numbers, and underscores.'),
  ]),
  public_email: v.string('Your email must be a string.', [
    v.email('The email address is badly formatted.')
  ])
});
export type ProfileForm = Input<typeof ProfileSchema>
