import type { TextProps } from "@seed-design/react";

export const footerLinkTextStyles = {
	mobile: { fontSize: "t2", lineHeight: "t3" },
	desktop: { fontSize: "t3", lineHeight: "t3" },
} as const satisfies Record<string, Pick<TextProps, "fontSize" | "lineHeight">>;
