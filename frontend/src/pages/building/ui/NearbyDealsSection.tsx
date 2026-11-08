import { Text, VStack } from "@seed-design/react";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import NearbyDealsFilter from "@/features/filterNearbyDeals/ui/NearbyDealsFilter";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import { nearbyDealsSectionStyles } from "@/pages/building/config/nearbyDealsSectionStyles";
import AreaFixedRow from "@/pages/building/ui/AreaFixedRow";
import LocationMissingNotice from "@/pages/building/ui/LocationMissingNotice";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealsSectionProps {
	layout: ResponsiveVariant;
	buildingId: number;
	condition: NearbyDealsCondition;
	result: NearbyDealsResult;
}

/**
 * 건물 상세 > 주변 전월세 거래 영역
 *
 * - 위치 정보가 없으면 제목과 위치 정보 없음 안내만 출력
 * - 위치 정보가 있으면 제목 아래에 필터 출력
 * - 면적 조건을 적용했을 때만 필터 상자 마지막 줄에 면적 고정 줄 출력
 * - 모바일은 흰 영역, 데스크톱은 테두리가 있는 카드로 출력
 *
 * @param layout 섹션 모양과 `id` 접미사를 정함
 */
export default function NearbyDealsSection({
	layout,
	buildingId,
	condition,
	result,
}: NearbyDealsSectionProps) {
	const style = nearbyDealsSectionStyles[layout];
	const titleId = `nearby-deals-title-${layout}`;

	if (result.kind === "noLocation") {
		return (
			<VStack as="section" aria-labelledby={titleId} {...style.section}>
				<Text as="h2" id={titleId} {...style.title}>
					{nearbyDealsCopy.title}
				</Text>
				<LocationMissingNotice layout={layout} />
			</VStack>
		);
	}

	return (
		<VStack as="section" aria-labelledby={titleId} {...style.section}>
			<Text as="h2" id={titleId} {...style.title}>
				{nearbyDealsCopy.title}
			</Text>
			<NearbyDealsFilter
				layout={layout}
				buildingId={buildingId}
				condition={condition}
			>
				{result.areaConditionApplied && <AreaFixedRow layout={layout} />}
			</NearbyDealsFilter>
		</VStack>
	);
}
