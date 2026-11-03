import type { TextStyle } from "@/shared/model/textStyle";

export const typography = {
	size12: { fontSize: "t2", lineHeight: "t3" },
	size13: { fontSize: "t3", lineHeight: "t3" },
	size14: { fontSize: "t4", lineHeight: "20px" },
	size20: { fontSize: "t7", lineHeight: "28px" },
	size22: { fontSize: "t8", lineHeight: "t8" },
} as const satisfies Record<string, TextStyle>;
