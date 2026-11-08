import { Box, Text } from "@seed-design/react";
import Link from "next/link";
import { nearbyDealsFilterStyles } from "@/features/filterNearbyDeals/config/nearbyDealsFilterStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealsFilterChipProps {
	layout: ResponsiveVariant;
	href: string;
	label: string;
	selected: boolean;
}

/**
 * 주변 거래 필터 > 칩
 *
 * - 선택한 칩은 진한 배경, 굵은 글자, `aria-current="true"`로 출력
 * - 선택하지 않은 칩은 옅은 배경, 중간 굵기 글자로 출력하고 `aria-current`를 두지 않음
 * - 누르면 스크롤 위치를 유지한 채 쿼리가 바뀐 주소로 이동
 *
 * @param href 이 칩을 선택한 조건의 주소
 */
export default function NearbyDealsFilterChip({
	layout,
	href,
	label,
	selected,
}: NearbyDealsFilterChipProps) {
	const style = nearbyDealsFilterStyles[layout];

	if (selected) {
		return (
			<Box asChild {...style.selected.chip}>
				<Link href={href} scroll={false} aria-current="true">
					<Text {...style.chipLabel} {...style.selected.label}>
						{label}
					</Text>
				</Link>
			</Box>
		);
	}

	return (
		<Box asChild {...style.unselected.chip}>
			<Link href={href} scroll={false}>
				<Text {...style.chipLabel} {...style.unselected.label}>
					{label}
				</Text>
			</Link>
		</Box>
	);
}
