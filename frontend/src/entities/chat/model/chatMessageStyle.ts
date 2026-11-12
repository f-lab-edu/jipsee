import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface ChatMessageStyle {
	userArticle: VStackProps;
	userBubble: BoxProps;
	userText: TextProps;
	assistantArticle: VStackProps;
	assistantBubble: VStackProps;
	assistantLine: TextProps;
	waitingBubble: HStackProps;
	waitingDot: BoxProps;
	caret: BoxProps;
	sources: VStackProps;
	sourceLine: TextProps;
	buildingLink: BoxProps;
	buildingLinkText: TextProps;
	buildingLinkIcon: Omit<IconProps, "svg">;
}
