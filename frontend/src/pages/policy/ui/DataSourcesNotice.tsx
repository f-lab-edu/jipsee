import { Box, Text } from "@seed-design/react";
import { dataSourcesCopy } from "@/pages/policy/config/dataSourcesCopy";
import { dataSourcesStyles } from "@/pages/policy/config/dataSourcesStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DataSourcesNoticeProps {
	layout: ResponsiveVariant;
}

/**
 * 데이터 출처 > 한계 안내
 *
 * - 세 줄을 `role="note"` 상자로 출력
 * - 마지막 줄의 부동산공시가격 알리미는 새 탭에서 열리는 링크
 */
export default function DataSourcesNotice({ layout }: DataSourcesNoticeProps) {
	const style = dataSourcesStyles;
	const { noticeLines, priceNotice } = dataSourcesCopy;

	return (
		<Box
			role="note"
			data-area={`data-sources-notice-${layout}`}
			{...style.notice}
		>
			{noticeLines.map((line) => (
				<Text as="p" key={line} {...style.noticeText}>
					{line}
				</Text>
			))}
			<Text as="p" {...style.noticeText}>
				{priceNotice.prefix}
				<a href={priceNotice.href} target="_blank" rel="noopener noreferrer">
					<Text {...style.noticeLink}>{priceNotice.linkLabel}</Text>
				</a>
				{priceNotice.suffix}
			</Text>
		</Box>
	);
}
