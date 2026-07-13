export const identity: (x: any) => any = x => {
	return x;
};

export const coalesce: <T1, T2>(t1: T1, t2: T2) => T1 | T2 | undefined = (
	...rest
) => {
	return Array.from(rest).find(identity);
};
