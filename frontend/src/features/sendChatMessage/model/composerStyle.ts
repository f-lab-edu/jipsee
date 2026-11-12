import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextFieldRootProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface ComposerStyle {
	bar: BoxProps;
	field: Pick<TextFieldRootProps, "className">;
	sendButton: BoxProps;
	sendButtonDisabled: BoxProps;
	sendIcon: Omit<IconProps, "svg">;
	limitBox: HStackProps;
	limitIconCell: BoxProps;
	limitIcon: Omit<IconProps, "svg">;
	limitText: VStackProps;
	limitTitle: TextProps;
	limitDescription: TextProps;
}
