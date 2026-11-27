import { Text, VStack } from "@seed-design/react";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import NearbyDealsFilter from "@/features/filterNearbyDeals/ui/NearbyDealsFilter";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import { nearbyDealsSectionStyles } from "@/pages/building/config/nearbyDealsSectionStyles";
import { toNearbyNoticeTitle } from "@/pages/building/lib/toNearbyNoticeTitle";
import AreaFixedRow from "@/pages/building/ui/AreaFixedRow";
import ConfirmedDateNotice from "@/pages/building/ui/ConfirmedDateNotice";
import NearbyDealList from "@/pages/building/ui/NearbyDealList";
import NearbyDealsNotice from "@/pages/building/ui/NearbyDealsNotice";
import NearbyDealsSummary from "@/pages/building/ui/NearbyDealsSummary";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealsSectionProps {
	layout: ResponsiveVariant;
	buildingId: string;
	condition: NearbyDealsCondition;
	result: NearbyDealsResult;
	rentDealBaseMonth: Nullable<YearMonth>;
}

/**
 * 건물 상세 > 주변 전월세 거래 영역
 *
 * - 제목 아래에 필터 출력
 * - 필터 상자 마지막 줄에 면적 고정 줄 출력
 * - 필터 아래에 건수 줄, 조건 확장 안내, 주변 거래 목록, 확정일자 안내 순서로 출력
 * - 조건 확장 안내는 건수가 기준보다 적을 때만 출력
 * - 건수는 조건에 맞는 전체 건수(totalCount)를 사용
 * - 건수가 0이어도 건수 줄과 확정일자 안내는 출력하고 목록만 출력하지 않음
 * - 모바일은 흰 영역, 데스크톱은 테두리가 있는 카드로 출력
 *
 * @param layout 섹션 모양과 `id` 접미사 결정
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

	const noticeTitle = toNearbyNoticeTitle(result.totalCount);

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
				<AreaFixedRow layout={layout} />
			</NearbyDealsFilter>
			<NearbyDealsSummary
				layout={layout}
				count={result.totalCount}
				baseMonth={rentDealBaseMonth}
			/>
			{noticeTitle && <NearbyDealsNotice layout={layout} title={noticeTitle} />}
			<NearbyDealList layout={layout} deals={result.deals} />
			<ConfirmedDateNotice layout={layout} />
		</VStack>
	);
}
