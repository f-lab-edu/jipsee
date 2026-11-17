import type { BoxProps } from "@seed-design/react";

export interface HeaderRootStyle {
	root: BoxProps;
}

// z-index는 본문보다 높고 Seed 다이얼로그, 시트(2)보다 낮게 둠
export const headerRootStyles: HeaderRootStyle = {
	root: { position: "sticky", top: 0, zIndex: 1 },
};
