import type { BoxProps, IconProps } from "@seed-design/react";

export interface ChatQuestionFormStyle {
	sendButton: BoxProps;
	sendIcon: Omit<IconProps, "svg">;
}
