import { Box, HStack } from "@seed-design/react";
import { footerLinks } from "@/widgets/footer/config/footerLinks";
import FooterLink from "@/widgets/footer/ui/FooterLink";

/** 모바일 Footer */
export default function MobileFooter() {
	return (
		<Box
			hideFrom="lg"
			data-testid="footer-mobile"
			borderTopWidth={1}
			borderColor="stroke.neutralMuted"
			px="x4"
			pb="x1"
		>
			<HStack
				height="39px"
				gap="x5"
				justifyContent="center"
				alignItems="center"
			>
				{footerLinks.map((link) => (
					<FooterLink key={link.href} link={link} variant="mobile" />
				))}
			</HStack>
		</Box>
	);
}
