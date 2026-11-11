"use client";

import {
	Box,
	ResponsiveDialogRoot,
	ResponsiveDialogTrigger,
	Text,
	useBreakpointValue,
} from "@seed-design/react";
import { withdrawCopy } from "@/features/withdrawAccount/config/withdrawCopy";
import { withdrawStyles } from "@/features/withdrawAccount/config/withdrawStyles";
import WithdrawDialog from "@/features/withdrawAccount/ui/WithdrawDialog";

/**
 * 회원 탈퇴 > 버튼
 *
 * - 글자 버튼을 누르면 확인 창을 엶
 * - lg 미만은 바텀시트, lg 이상은 대화상자로 출력
 * - 화면 폭이 lg 경계를 넘으면 루트를 새로 만들어 열려 있던 창을 닫음
 */
export default function WithdrawButton() {
	const style = withdrawStyles;
	const isBottomSheet = useBreakpointValue({ base: true, lg: false });

	return (
		<ResponsiveDialogRoot key={String(isBottomSheet)} dialogBreakpoint="lg">
			<ResponsiveDialogTrigger asChild>
				<Box asChild {...style.trigger}>
					<button type="button">
						<Text {...style.triggerText}>{withdrawCopy.label}</Text>
					</button>
				</Box>
			</ResponsiveDialogTrigger>
			<WithdrawDialog />
		</ResponsiveDialogRoot>
	);
}
