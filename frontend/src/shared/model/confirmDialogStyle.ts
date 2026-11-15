import type {
	BoxProps,
	GridProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface ConfirmDialogStyle {
	contentClassName: string;
	body: VStackProps;
	title: TextProps;
	description: TextProps;
	form: BoxProps;
	buttons: GridProps;
	cancelButton: BoxProps;
	cancelText: TextProps;
	confirmButton: BoxProps;
	confirmText: TextProps;
}
