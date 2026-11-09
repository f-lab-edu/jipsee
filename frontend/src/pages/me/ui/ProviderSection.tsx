import { Box, HStack, Text, VStack } from "@seed-design/react";
import { providerNames } from "@/entities/session/config/providerNames";
import type { Provider } from "@/entities/session/model/session";
import ProviderIcon from "@/entities/session/ui/ProviderIcon";
import { meCopy } from "@/pages/me/config/meCopy";
import { meSectionStyles, meStyles } from "@/pages/me/config/meStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface ProviderSectionProps {
	layout: ResponsiveVariant;
	provider: Provider;
}

/**
 * 내 정보 > 로그인 수단 영역
 *
 * - 제목, 제공자 표시, 로그아웃 버튼 순서로 출력
 * - 데스크톱은 테두리가 있는 카드로 출력
 *
 * @param layout 섹션 모양과 `id` 접미사를 정함
 */
export default function ProviderSection({
	layout,
	provider,
}: ProviderSectionProps) {
	const style = meSectionStyles[layout];
	const titleId = `provider-title-${layout}`;

	return (
		<VStack
			as="section"
			aria-labelledby={titleId}
			data-area={`provider-section-${layout}`}
			{...style.section}
		>
			<Text as="h2" id={titleId} {...style.title}>
				{meCopy.providerTitle}
			</Text>
			<HStack {...style.provider}>
				<Box {...meStyles.providerIcon[provider]}>
					<ProviderIcon
						provider={provider}
						size={meStyles.providerIconSize[provider]}
					/>
				</Box>
				<Text {...style.providerName}>{providerNames[provider]}</Text>
			</HStack>
			<Box asChild {...style.logout}>
				<button type="button">
					<Text {...style.logoutText}>{meCopy.logout}</Text>
				</button>
			</Box>
		</VStack>
	);
}
