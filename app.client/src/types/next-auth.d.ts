import { DefaultSession, ISODateString } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';
import type { AccessType } from '.';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			accessType?: AccessType | null;
			hasPassword: boolean;
			profileId?: number | null;
			emailVerified?: Date | null;
		};
		expires?: ISODateString;
	}

	interface User {
		id?: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
		hasPassword: boolean;
		accessType?: AccessType | null;
		profileId?: number | null;
		emailVerified?: Date | null;
	}
	interface AdapterUser extends User {
		password: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		id?: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
		hasPassword: boolean;
		accessType?: AccessType | null;
		profileId?: number | null;
		emailVerified?: Date | null;
	}
}
