import { Box, Text, VStack } from "@seed-design/react";
import { meCopy } from "@/pages/me/config/meCopy";
import { meSectionStyles } from "@/pages/me/config/meStyles";
import { policyLinks } from "@/pages/me/config/policyLinks";
import PolicyRow from "@/pages/me/ui/PolicyRow";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PolicySectionProps {
	layout: ResponsiveVariant;
}

/**
 * 내 정보 > 약관과 정책 영역
 *
 * - 이용약관, 개인정보처리방침, 데이터 출처 링크 행을 목록으로 출력
 * - 데스크톱은 테두리가 있는 카드로 출력
 *
 * @param layout 섹션 모양과 `id` 접미사를 정함
 */
export default function PolicySection({ layout }: PolicySectionProps) {
	const style = meSectionStyles[layout];
	const titleId = `policy-title-${layout}`;

	return (
		<VStack
			as="section"
			aria-labelledby={titleId}
			data-area={`policy-section-${layout}`}
			{...style.policySection}
		>
			<Text as="h2" id={titleId} {...style.title}>
				{meCopy.policyTitle}
			</Text>
			<Box as="ul">
				{policyLinks.map(({ label, href }) => (
					<PolicyRow key={href} layout={layout} label={label} href={href} />
				))}
			</Box>
		</VStack>
	);
}
