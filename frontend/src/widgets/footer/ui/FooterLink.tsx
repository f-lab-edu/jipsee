import { Text } from "@seed-design/react";
import Link from "next/link";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import type { footerLinks } from "@/widgets/footer/config/footerLinks";
import { footerStyles } from "@/widgets/footer/config/footerStyles";

interface FooterLinkProps {
	link: (typeof footerLinks)[number];
	variant: ResponsiveVariant;
}

/**
 * 푸터 > 링크
 *
 * - 강조된 링크는 굵게 출력
 *
 * @param variant 글자 크기를 고를 화면 크기
 */
export default function FooterLink({ link, variant }: FooterLinkProps) {
	const style = footerStyles[variant];

	if (link.emphasized) {
		return (
			<Link href={link.href}>
				<Text {...style.emphasizedLinkText}>{link.label}</Text>
			</Link>
		);
	}

	return (
		<Link href={link.href}>
			<Text {...style.linkText}>{link.label}</Text>
		</Link>
	);
}
