import { Text, VStack } from "@seed-design/react";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import NearbyDealsFilter from "@/features/filterNearbyDeals/ui/NearbyDealsFilter";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import { nearbyDealsSectionStyles } from "@/pages/building/config/nearbyDealsSectionStyles";
import { toNearbyNoticeTitle } from "@/pages/building/lib/toNearbyNoticeTitle";
import AreaFixedRow from "@/pages/building/ui/AreaFixedRow";
import ConfirmedDateNotice from "@/pages/building/ui/ConfirmedDateNotice";
import LocationMissingNotice from "@/pages/building/ui/LocationMissingNotice";
import NearbyDealList from "@/pages/building/ui/NearbyDealList";
import NearbyDealsNotice from "@/pages/building/ui/NearbyDealsNotice";
import NearbyDealsSummary from "@/pages/building/ui/NearbyDealsSummary";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealsSectionProps {
	layout: ResponsiveVariant;
	buildingId: number;
	condition: NearbyDealsCondition;
	result: NearbyDealsResult;
	rentDealBaseMonth: YearMonth;
}

/**
 * 건물 상세 > 주변 전월세 거래 영역
 *
 * - 위치 정보가 없으면 제목과 위치 정보 없음 안내만 출력
 * - 위치 정보가 있으면 제목 아래에 필터 출력
 * - 면적 조건을 적용했을 때만 필터 상자 마지막 줄에 면적 고정 줄 출력
 * - 필터 아래에 건수 줄, 조건 확장 안내, 주변 거래 목록, 확정일자 안내 순서로 출력
 * - 조건 확장 안내는 건수가 기준보다 적을 때만 출력
 * - 건수가 0이어도 건수 줄과 확정일자 안내는 출력하고 목록만 출력하지 않음
 * - 모바일은 흰 영역, 데스크톱은 테두리가 있는 카드로 출력
 *
 * @param layout 섹션 모양과 `id` 접미사를 정함
 * @param rentDealBaseMonth 건수 줄에 표시할 실거래 기준 월
 */
export default function NearbyDealsSection({
	layout,
	buildingId,
	condition,
	result,
	rentDealBaseMonth,
}: NearbyDealsSectionProps) {
	const style = nearbyDealsSectionStyles[layout];
	const titleId = `nearby-deals-title-${layout}`;

	if (result.kind === "noLocation") {
		return (
			<VStack
				as="section"
				aria-labelledby={titleId}
				data-area={`nearby-deals-${layout}`}
				{...style.section}
			>
				<Text as="h2" id={titleId} {...style.title}>
					{nearbyDealsCopy.title}
				</Text>
				<LocationMissingNotice layout={layout} />
			</VStack>
		);
	}

	const noticeTitle = toNearbyNoticeTitle(result.deals.length);

	return (
		<VStack
			as="section"
			aria-labelledby={titleId}
			data-area={`nearby-deals-${layout}`}
			{...style.section}
		>
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
			<NearbyDealsSummary
				layout={layout}
				count={result.deals.length}
				baseMonth={rentDealBaseMonth}
			/>
			{noticeTitle && <NearbyDealsNotice layout={layout} title={noticeTitle} />}
			<NearbyDealList layout={layout} deals={result.deals} />
			<ConfirmedDateNotice layout={layout} />
		</VStack>
	);
}
