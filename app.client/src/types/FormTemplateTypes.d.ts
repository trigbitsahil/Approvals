export interface TemplateType {
	formName: string;
	id: string;
	formLayoutComponents: FormLayoutComponentsType[];
	publishHistory: FormLayoutHistoryType[];
	isPublished: boolean;
	formLinkName: string;
}

export interface FormLayoutComponentsType {
	container: FormLayoutComponentContainerType;
	children: FormLayoutComponentChildrenType[];
}

export interface FormLayoutHistoryType {
	lastPublishedAt: number;
	formLayoutComponents: FormLayoutComponentsType[];
}

interface FormLayoutComponentContainerType {
	controlName: string;
	displayText: string;
	itemType: string;
	icon: string;
	heading: string;
	subHeading: string;
	id: string;
	desktopWidth?: number;
}

interface FormLayoutComponentChildrenType {
	controlName: string;
	displayText: string;
	description: string;
	labelName: string;
	itemType: string;
	icon: string;
	required: boolean;
	items?: FormLayoutCoponentChildrenItemsType[];
	category: string;
	index?: number;
	id: string;
	containerId: string;
	placeholder?: string;
	rows?: number;
	dataType?: string;
	position?: number;
}

interface FormLayoutCoponentChildrenItemsType {
	id: string;
	value: string;
	label: string;
}
