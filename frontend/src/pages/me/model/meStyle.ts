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
	logout: BoxProps;
	logoutText: TextProps;
}

export interface MeStyle {
	main: VStackProps;
	mobileBody: VStackProps;
	mobileTitleBox: BoxProps;
	mobileTitle: TextProps;
	desktopBody: VStackProps;
	desktopColumn: VStackProps;
	desktopTitleBox: BoxProps;
	desktopTitle: TextProps;
	providerIcon: Record<Provider, BoxProps>;
	providerIconSize: Record<Provider, number>;
}
