"use client";

import {
	Box,
	ResponsiveDialogRoot,
	ResponsiveDialogTrigger,
	Text,
} from "@seed-design/react";
import { withdrawCopy } from "@/features/withdrawAccount/config/withdrawCopy";
import { withdrawStyles } from "@/features/withdrawAccount/config/withdrawStyles";
import WithdrawDialog from "@/features/withdrawAccount/ui/WithdrawDialog";

/**
 * 회원 탈퇴 > 버튼
 *
 * - 글자 버튼을 누르면 확인 창을 엶
 * - lg 미만은 바텀시트, lg 이상은 대화상자로 출력
 */
export default function WithdrawButton() {
	const style = withdrawStyles;

	return (
		<ResponsiveDialogRoot dialogBreakpoint="lg">
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
