import { C8_COLORS } from "./c8Fixtures";
import type { Theme } from "./tokens";
import { TOKENS } from "./tokens";

export function c9ExpectColor(
	key: "jeonse" | "sale" | "muted" | "previous",
	theme: Theme,
) {
	return key === "muted" ? TOKENS[theme].fgMuted : C8_COLORS[theme][key];
}
