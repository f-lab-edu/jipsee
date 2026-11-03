import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextFieldInputProps,
	TextFieldRootProps,
	TextProps,
} from "@seed-design/react";

export interface SearchFormStyle {
	container: BoxProps;
	row: HStackProps;
	fieldCell: BoxProps;
	field: TextFieldRootProps;
	input: TextFieldInputProps;
	leading: BoxProps;
	leadingIcon: Omit<IconProps, "svg">;
	iconButton: BoxProps;
	iconButtonIcon: Omit<IconProps, "svg">;
	textButton: BoxProps;
	textButtonLabel: TextProps;
}
