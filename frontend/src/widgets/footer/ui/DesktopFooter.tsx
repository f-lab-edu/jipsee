import { Box, HStack } from "@seed-design/react";
import ContentContainer from "@/shared/ui/ContentContainer";
import { footerLinks } from "@/widgets/footer/config/footerLinks";
import FooterLink from "@/widgets/footer/ui/FooterLink";

/** 데스크탑 Footer */
export default function DesktopFooter() {
	return (
		<Box
			display={{ base: "none", lg: "block" }}
			data-testid="footer-desktop"
			borderTopWidth={1}
			borderColor="stroke.neutralMuted"
		>
			<ContentContainer>
				<HStack height="48px" gap="x6" alignItems="center">
					{footerLinks.map((link) => (
						<FooterLink key={link.href} link={link} variant="desktop" />
					))}
				</HStack>
			</ContentContainer>
		</Box>
	);
}
