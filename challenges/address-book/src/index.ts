interface Contact {
  firstName: string;
  middleName?: string;
  lastName: string;
  salutation?: string;
  addresses: {
    [addressName: string]: {
      houseNumber: number;
      postalCode: number;
      street: string;
      city: string;
      country: string;
      state: string;
    };
  };
  phones: {
    [phoneName: string]: string;
  };
  email?: string;
}

export class AddressBook {
  contacts: Contact[] = [];

  addContact(contact: Contact) {
    this.contacts.push(contact);
  }

  findContactByName(filter: { firstName?: string; lastName?: string }) {
    return this.contacts.filter((c) => {
      if (
        typeof filter.firstName !== "undefined" &&
        c.firstName !== filter.firstName
      ) {
        return false;
      }
      if (
        typeof filter.lastName !== "undefined" &&
        c.lastName !== filter.lastName
      ) {
        return false;
      }
      return true;
    });
  }
}

export function formatDate(date: Date) {
  return date.toISOString().replace(/[-:]+/g, "").split(".")[0] + "Z";
}

function getFullName(contact: Contact) {
  return [contact.firstName, contact.middleName, contact.lastName]
    .filter(Boolean)
    .join(" ");
}

export function getVcardText(contact: Contact, date: Date = new Date()) {
  const parts = [
    "BEGIN:VCARD",
    "VERSION:2.1",
    `N:${contact.lastName};${contact.firstName};${contact.middleName || ""};${
      contact.salutation || ""
    }`,
    `FN:${getFullName(contact)}`,
    ...Object.keys(contact.phones).map(
      (phName) => `TEL;${phName.toUpperCase()};VOICE:${contact.phones[phName]}`
    ),
    ...Object.keys(contact.addresses)
      .map((addrName) => {
        const address = contact.addresses[addrName];
        if (address) {
          return `ADR;${addrName.toUpperCase()}:;;${address.houseNumber} ${
            address.street
          };${address.city};${address.state};${address.postalCode};${
            address.country
          }\nLABEL;${addrName.toUpperCase()};ENCODING=QUOTED-PRINTABLE;CHARSET=UTF-8:${
            address.houseNumber
          } ${address.street}.=0D=0A=${address.city}, ${address.state} ${
            address.postalCode
          }=0D=0A${address.country}`;
        } else {
          return "";
        }
      })
      .filter(Boolean),
  ];

  if (contact.email) {
    parts.push(`EMAIL:${contact.email}`);
  }

  parts.push(`REV:${formatDate(date)}`);
  parts.push("END:VCARD");
  return parts.join("\n");
}
