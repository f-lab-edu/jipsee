import type {
	BoxProps,
	HStackProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import type { Provider } from "@/entities/session/model/session";

export interface MeSectionStyle {
	section: VStackProps;
	title: TextProps;
	provider: HStackProps;
	providerName: TextProps;
	withdraw: BoxProps;
	withdrawBody: VStackProps;
	withdrawDescription: TextProps;
}

export interface MeStyle {
	main: VStackProps;
	mobileBody: VStackProps;
	mobileTitleBox: BoxProps;
	mobileTitle: TextProps;
	mobileDivider: BoxProps;
	mobileSpacer: BoxProps;
	desktopBody: VStackProps;
	desktopColumn: VStackProps;
	desktopTitleBox: BoxProps;
	desktopTitle: TextProps;
	providerIcon: Record<Provider, BoxProps>;
	providerIconSize: Record<Provider, number>;
}
