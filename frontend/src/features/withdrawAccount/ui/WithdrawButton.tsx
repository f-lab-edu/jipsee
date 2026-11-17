import { Box, Text } from "@seed-design/react";
import { withdrawCopy } from "@/features/withdrawAccount/config/withdrawCopy";
import { withdrawStyles } from "@/features/withdrawAccount/config/withdrawStyles";
import { paths } from "@/shared/routes/paths";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";

/**
 * 회원 탈퇴 > 버튼
 *
 * - 글자 버튼을 누르면 확인 창 열기
 */
export default function WithdrawButton() {
	const style = withdrawStyles;

	return (
		<ConfirmDialog
			trigger={
				<Box asChild {...style.trigger}>
					<button type="button">
						<Text {...style.triggerText}>{withdrawCopy.label}</Text>
					</button>
				</Box>
			}
			title={withdrawCopy.dialogTitle}
			description={withdrawCopy.description}
			confirmLabel={withdrawCopy.confirm}
			action={paths.withdrawAction}
		/>
	);
}
