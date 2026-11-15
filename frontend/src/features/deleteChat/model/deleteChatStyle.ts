import type { BoxProps, TextProps } from "@seed-design/react";

export interface DeleteChatStyle {
	trigger: Record<"list" | "rail", BoxProps>;
	triggerText: TextProps;
}
