import type { BoxProps, TextProps } from "@seed-design/react";
import type { Provider } from "@/entities/session/model/session";

export interface LoginButtonStyle {
	button: Record<Provider, BoxProps>;
	iconBox: BoxProps;
	iconSize: Record<Provider, number>;
	label: Record<Provider, TextProps>;
}
