import { Box, Text, VStack } from "@seed-design/react";
import { dataSourcesCopy } from "@/pages/policy/config/dataSourcesCopy";
import { dataSourcesStyles } from "@/pages/policy/config/dataSourcesStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DataSourcesNoticeProps {
	layout: ResponsiveVariant;
}

/**
 * 데이터 출처 > 한계 안내
 *
 * - 세 줄을 테두리 있는 `section` 안 글머리 목록으로 출력
 * - 마지막 줄의 부동산공시가격 알리미는 새 탭에서 열리는 링크
 */
export default function DataSourcesNotice({ layout }: DataSourcesNoticeProps) {
	const style = dataSourcesStyles[layout];
	const { noticeLabel, noticeLines, priceNotice } = dataSourcesCopy;

	return (
		<VStack
			as="section"
			aria-label={noticeLabel}
			data-area={`data-sources-notice-${layout}`}
			{...style.notice}
		>
			<VStack as="ul" {...style.noticeList}>
				{noticeLines.map((line) => (
					<li key={line}>
						<Box {...style.noticeItem}>
							<Text {...style.noticeText}>{line}</Text>
						</Box>
					</li>
				))}
				<li>
					<Box {...style.noticeItem}>
						<Text {...style.noticeText}>
							{priceNotice.prefix}
							<a
								href={priceNotice.href}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Text {...style.noticeLink}>{priceNotice.linkLabel}</Text>
							</a>
							{priceNotice.suffix}
						</Text>
					</Box>
				</li>
			</VStack>
		</VStack>
	);
}
