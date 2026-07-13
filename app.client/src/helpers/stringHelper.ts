/* eslint-disable no-extend-native */
export const normalize = (str: string): string => {
	return (
		str
			.trim()
			// .normalize('NFC')
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
	);
};

export const normalizeSlug = (str: string, spaceReplace = '-'): string => {
	return str
		.replace(/-+/g, ' ')
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9-_\s]+/g, '')
		.replace(/\s+/g, spaceReplace)
		.toLowerCase();
};

export const normalizeHTMLAttribute = (str: string): string => {
	return str
		.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
		.replace(
			/'/g,
			'&apos;',
		) /* The 4 other predefined entities, required. */
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\r\n/g, '\n') /* Must be before the next replacement. */
		.replace(/[\r\n]/g, '\n');
};

export const initials = (content: string): string => {
	if (!content || content.trim().length === 0) {
		return content;
	}
	const newStr = content.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	const initials = newStr.split(' ');

	if (initials[0].length === 0) {
		return '';
	}

	let name = initials[0].slice(0, 1);

	if (initials.length > 1) {
		name += initials[initials.length - 1].slice(0, 1);

		return name;
	}

	return name || '';
};

const chars = '123ZEFGHIJ'.split('');

export const hashCode = (str: string): string | number => {
	let hash = 0;
	if (str.length === 0) {
		return hash;
	}
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		// hash &= hash; // Convert to 32bit integer
	}
	const hashStr = `${Math.abs(hash)}`.split('');
	const result = hashStr.map(char => chars[parseInt(char, 10)]);
	return result.join('');
};
export const capitalize = (str: string): string =>
	`${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;

type replaceFunc = (e: string, i: number, a: number) => string;
const replaceString = (
	str: string,
	re: string | RegExp,
	replaceFn: replaceFunc,
) => {
	if (!str) {
		return str;
	}
	let curCharStart = 0;
	let curCharLen = 0;
	const strArray = str.split(re);
	for (let i = 1, length = strArray.length; i < length; i += 1) {
		curCharLen = strArray[i].length;
		curCharStart += strArray[i - 1].length;
		if (strArray[i]) {
			strArray[i] = replaceFn(strArray[i], i, curCharStart);
		}
		curCharStart += curCharLen;
	}
	return strArray;
};

export const reactStringReplace = (
	source: string | string[],
	re: string | RegExp,
	replaceFn: replaceFunc,
): string[] => {
	if (!Array.isArray(source)) {
		source = [source];
	}

	return source.reduce((acc, x) => {
		return acc.concat(replaceString(x, re, replaceFn));
	}, [] as string[]);
};

export const trimFileName = (name?: string, length = 30) => {
	if (!name) {
		return name;
	}
	const ext = name.substring(name.lastIndexOf('.'));
	if (name.lastIndexOf('.') > length - ext.length) {
		return `${name.slice(
			0,
			length < name.lastIndexOf('.') ? length : length - ext.length,
		)}${ext}`;
	}
	return name;
};

export const stringOnly = (name: string) => {
	if (!name) {
		return name;
	}
	return name.replace(/[^a-zA-Z0-9]/g, '');
};
export const normalizeStringOnly = (name: string) => {
	if (!name) {
		return name;
	}
	return normalize(name.replace(/[^a-zA-Z0-9]/g, ''));
};

export const stringAsNumber = (value: string | null) => {
	if (!value) {
		return value;
	}
	const val = parseFloat(value);
	return Number.isNaN(val) ? 0 : val;
};

export const getAge = (dob: Date) => {
	const dobS = dob.toString();
	const dobYear = dobS.slice(0, 4);
	const newDate = new Date().getFullYear();
	const age = Number(newDate) - Number(dobYear);
	return age;
};

export const cmToFeetAndInches = (cm: number) => {
	// Convert cm to inches
	const inches = cm / 2.54;

	// Calculate feet and inches
	const feet = Math.floor(inches / 12);
	const remainingInches = inches % 12;

	return feet + "'" + remainingInches.toFixed(0);
};

export const Kgtolbs = (weight: number) => {
	if (!weight) {
		return weight;
	}
	return Math.floor(Math.trunc(weight * 2.2046));
};
