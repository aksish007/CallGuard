export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface Group {
  id: string;
  name: string;
  isEnabled: boolean;
  contacts: Contact[];
}