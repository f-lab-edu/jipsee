import { Box, HStack } from "@seed-design/react";
import ContentContainer from "@/shared/ui/ContentContainer";
import { footerLinks } from "@/widgets/footer/config/footerLinks";
import { footerStyles } from "@/widgets/footer/config/footerStyles";
import FooterLink from "@/widgets/footer/ui/FooterLink";

/** 푸터 > 데스크톱 레이아웃 */
export default function DesktopFooter() {
	const style = footerStyles.desktop;

	return (
		<Box {...style.container}>
			<ContentContainer>
				<HStack {...style.linksRow}>
					{footerLinks.map((link) => (
						<FooterLink key={link.href} link={link} variant="desktop" />
					))}
				</HStack>
			</ContentContainer>
		</Box>
	);
}
