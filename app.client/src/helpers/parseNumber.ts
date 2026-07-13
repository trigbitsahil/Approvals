export const parseNum = (inputString: string): number => {
	const parsedNumber = parseInt(inputString, 10);

	if (isNaN(parsedNumber)) {
		throw new Error('Invalid input: not a valid number');
	}

	return parsedNumber;
};
