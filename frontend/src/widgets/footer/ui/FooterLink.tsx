import { Text } from "@seed-design/react";
import Link from "next/link";
import type { footerLinks } from "@/widgets/footer/config/footerLinks";
import { footerLinkTextStyles } from "@/widgets/footer/config/footerLinkTextStyles";

interface FooterLinkProps {
	link: (typeof footerLinks)[number];
	variant: keyof typeof footerLinkTextStyles;
}

/** 푸터 링크 하나를 표시하고, 강조된 링크는 굵게 표시함 */
export default function FooterLink({ link, variant }: FooterLinkProps) {
	const textStyle = footerLinkTextStyles[variant];

	if (link.emphasized) {
		return (
			<Link href={link.href}>
				<Text {...textStyle} fontWeight="bold" color="fg.neutralMuted">
					{link.label}
				</Text>
			</Link>
		);
	}

	return (
		<Link href={link.href}>
			<Text {...textStyle} color="fg.neutralMuted">
				{link.label}
			</Text>
		</Link>
	);
}
