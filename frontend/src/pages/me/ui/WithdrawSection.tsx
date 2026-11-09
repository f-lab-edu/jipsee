import { Box, Text, VStack } from "@seed-design/react";
import { meCopy } from "@/pages/me/config/meCopy";
import { meSectionStyles } from "@/pages/me/config/meStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface WithdrawSectionProps {
	layout: ResponsiveVariant;
}

/**
 * 내 정보 > 회원 탈퇴 영역
 *
 * - 글자 버튼과 설명 출력
 * - 버튼은 모양만 있고 확인 창과 연결하지 않음
 *
 * @param layout 영역 여백을 정함
 */
export default function WithdrawSection({ layout }: WithdrawSectionProps) {
	const style = meSectionStyles[layout];

	return (
		<Box data-area={`withdraw-section-${layout}`} {...style.withdraw}>
			<VStack {...style.withdrawBody}>
				<Box asChild {...style.withdrawButton}>
					<button type="button">
						<Text {...style.withdrawButtonText}>{meCopy.withdraw}</Text>
					</button>
				</Box>
				<Text as="p" {...style.withdrawDescription}>
					{meCopy.withdrawDescription}
				</Text>
			</VStack>
		</Box>
	);
}
