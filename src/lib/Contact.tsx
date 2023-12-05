
export type ContactType = 'email' | 'phone'
export interface Contact {
    contactType: ContactType,
    value: string
}