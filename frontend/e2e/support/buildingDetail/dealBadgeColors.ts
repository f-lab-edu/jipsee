import type { C6Tokens } from "./c6Tokens";
import { hexToRgb } from "./hexToRgb";

/** 구분 배지의 배경과 글자 색 기대값 */
export function dealBadgeColors(kind: string, tk: C6Tokens) {
	const colors: Record<string, { bg: string; fg: string }> = {
		jeonse: {
			bg: hexToRgb(tk.brandWeak),
			fg: hexToRgb(tk.informativeContrast),
		},
		wolse: {
			bg: hexToRgb(tk.positiveWeak),
			fg: hexToRgb(tk.positiveContrast),
		},
		sale: { bg: hexToRgb(tk.warningWeak), fg: hexToRgb(tk.warningContrast) },
	};
	return colors[kind];
}
