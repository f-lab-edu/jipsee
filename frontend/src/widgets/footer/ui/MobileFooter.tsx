import { Box, HStack } from "@seed-design/react";
import { footerLinks } from "@/widgets/footer/config/footerLinks";
import { footerStyles } from "@/widgets/footer/config/footerStyles";
import FooterLink from "@/widgets/footer/ui/FooterLink";

/** 푸터 > 모바일 레이아웃 */
export default function MobileFooter() {
	const style = footerStyles.mobile;

	return (
		<Box {...style.container}>
			<HStack {...style.linksRow}>
				{footerLinks.map((link) => (
					<FooterLink key={link.href} link={link} variant="mobile" />
				))}
			</HStack>
		</Box>
	);
}
