import { Box, HStack, Icon, Text } from "@seed-design/react";
import Link from "next/link";
import { meSectionStyles } from "@/pages/me/config/meStyles";
import PolicyArrowIcon from "@/pages/me/ui/PolicyArrowIcon";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicyRowProps {
	layout: ResponsiveVariant;
	label: string;
	href: string;
}

/** 내 정보 > 정책 행 링크 */
export default function PolicyRow({ layout, label, href }: PolicyRowProps) {
	const style = meSectionStyles[layout];

	return (
		<Box as="li">
			<Link href={href}>
				<HStack {...style.policyRow}>
					<Text {...style.policyLabel}>{label}</Text>
					<Box {...style.policyArrowCell}>
						<Icon svg={<PolicyArrowIcon />} {...style.policyArrow} />
					</Box>
				</HStack>
			</Link>
		</Box>
	);
}
