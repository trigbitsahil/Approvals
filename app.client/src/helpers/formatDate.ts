export const formatDate = (date: Date | string) => {
	const formatD = new Date(date).toDateString();
	return formatD;
};
