import { Box, Text, VStack } from "@seed-design/react";
import { withdrawCopy } from "@/features/withdrawAccount/config/withdrawCopy";
import WithdrawButton from "@/features/withdrawAccount/ui/WithdrawButton";
import { meSectionStyles } from "@/pages/me/config/meStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface WithdrawSectionProps {
	layout: ResponsiveVariant;
}

/**
 * 내 정보 > 회원 탈퇴 영역
 *
 * - 확인 창을 여는 글자 버튼과 설명 출력
 *
 * @param layout 영역 여백을 정함
 */
export default function WithdrawSection({ layout }: WithdrawSectionProps) {
	const style = meSectionStyles[layout];

	return (
		<Box data-area={`withdraw-section-${layout}`} {...style.withdraw}>
			<VStack {...style.withdrawBody}>
				<WithdrawButton />
				<Text as="p" {...style.withdrawDescription}>
					{withdrawCopy.description}
				</Text>
			</VStack>
		</Box>
	);
}
