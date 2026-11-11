import { Box, Grid, Icon, Text } from "@seed-design/react";
import { externalLinks } from "@/pages/building/config/externalLinks";
import { externalLinksStyles } from "@/pages/building/config/externalLinksStyles";
import ExternalLinkIcon from "@/pages/building/ui/ExternalLinkIcon";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface ExternalLinksProps {
	layout: ResponsiveVariant;
}

/**
 * 건물 상세 > 외부 링크 영역
 *
 * - 링크는 새 탭에서 열림
 * - 모바일은 2열, 데스크톱은 세로 1열로 출력
 *
 * @param layout 열 수와 링크 안쪽 여백을 정함
 */
export default function ExternalLinks({ layout }: ExternalLinksProps) {
	const style = externalLinksStyles[layout];

	return (
		<Grid data-area={`external-links-${layout}`} {...style.container}>
			{externalLinks.map((link) => (
				<Box asChild key={link.href} {...style.link}>
					<a href={link.href} target="_blank" rel="noopener noreferrer">
						<Text {...style.label}>{link.label}</Text>
						<Icon svg={<ExternalLinkIcon />} {...style.icon} />
					</a>
				</Box>
			))}
		</Grid>
	);
}
