import { Box, Text } from "@seed-design/react";
import { logoutCopy } from "@/features/logout/config/logoutCopy";
import { logoutStyles } from "@/features/logout/config/logoutStyles";
import { paths } from "@/shared/routes/paths";

/**
 * 로그아웃 > 버튼
 *
 * - 로그아웃 경로로 POST하는 폼의 제출 버튼 출력
 */
export default function LogoutButton() {
	const style = logoutStyles;

	return (
		<form method="post" action={paths.logoutAction}>
			<Box asChild {...style.button}>
				<button type="submit">
					<Text {...style.text}>{logoutCopy.label}</Text>
				</button>
			</Box>
		</form>
	);
}
