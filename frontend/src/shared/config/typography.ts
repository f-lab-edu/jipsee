import type { TextStyle } from "@/shared/model/textStyle";

export const typography = {
	size12: { fontSize: "t2", lineHeight: "t3" },
	size13: { fontSize: "t3", lineHeight: "t3" },
	size13LineHeight20: { fontSize: "t3", lineHeight: "20px" },
	size14: { fontSize: "t4", lineHeight: "20px" },
	size15: { fontSize: "15px", lineHeight: "t5" },
	size16: { fontSize: "t5", lineHeight: "t5" },
	size16LineHeight24: { fontSize: "t5", lineHeight: "t6" },
	size20: { fontSize: "t7", lineHeight: "28px" },
	size22: { fontSize: "t8", lineHeight: "t8" },
	size24: { fontSize: "t9", lineHeight: "t9" },
	size26: { fontSize: "t10", lineHeight: "t10" },
	size34: { fontSize: "34px", lineHeight: "44px" },
} as const satisfies Record<string, TextStyle>;
