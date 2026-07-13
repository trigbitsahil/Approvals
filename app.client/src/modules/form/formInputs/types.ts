import type { UseFieldConfig } from 'react-final-form';
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type FieldProps<T extends Record<string, any>> = {
	name: string;
} & UseFieldConfig<any> &
	Optional<T, 'onChange' | 'value' | 'onBlur'>;
