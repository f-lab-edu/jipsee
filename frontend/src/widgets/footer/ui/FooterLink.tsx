"use client";

import { Text } from "@seed-design/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
 * - 현재 문서를 가리키는 링크만 굵게 출력
 *
 * @param variant 글자 크기를 고를 화면 크기
 */
export default function FooterLink({ link, variant }: FooterLinkProps) {
	const style = footerStyles[variant];
	const pathname = usePathname();

	if (pathname === link.href) {
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
