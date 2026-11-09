import {
	Box,
	Grid,
	ResponsiveDialogAction,
	ResponsiveDialogBackdrop,
	ResponsiveDialogBody,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHandle,
	ResponsiveDialogPositioner,
	ResponsiveDialogTitle,
	Text,
	VStack,
} from "@seed-design/react";
import { useState } from "react";
import { withdrawCopy } from "@/features/withdrawAccount/config/withdrawCopy";
import { withdrawStyles } from "@/features/withdrawAccount/config/withdrawStyles";
import { paths } from "@/shared/routes/paths";

/**
 * 회원 탈퇴 > 확인 창
 *
 * - 제목, 설명, 취소와 탈퇴하기 버튼 출력
 * - 취소는 창을 닫음
 * - 탈퇴하기는 탈퇴 경로로 POST하는 폼의 제출 버튼이며 닫기 동작으로 감싸지 않음
 * - 폼을 제출하면 탈퇴하기 버튼을 비활성화해 중복 요청을 막음
 */
export default function WithdrawDialog() {
	const style = withdrawStyles;
	const [isSubmitted, setIsSubmitted] = useState(false);

	return (
		<>
			<ResponsiveDialogBackdrop />
			<ResponsiveDialogPositioner>
				<ResponsiveDialogContent className={style.contentClassName}>
					<ResponsiveDialogHandle />
					<ResponsiveDialogBody>
						<VStack {...style.body}>
							<ResponsiveDialogTitle asChild>
								<Text as="h2" {...style.title}>
									{withdrawCopy.dialogTitle}
								</Text>
							</ResponsiveDialogTitle>
							<ResponsiveDialogDescription asChild>
								<Text as="p" {...style.description}>
									{withdrawCopy.description}
								</Text>
							</ResponsiveDialogDescription>
							<Box asChild {...style.form}>
								<form
									method="post"
									action={paths.withdrawAction}
									onSubmit={() => setIsSubmitted(true)}
								>
									<Grid {...style.buttons}>
										<ResponsiveDialogAction asChild>
											<Box asChild {...style.cancelButton}>
												<button type="button">
													<Text {...style.cancelText}>
														{withdrawCopy.cancel}
													</Text>
												</button>
											</Box>
										</ResponsiveDialogAction>
										<Box asChild {...style.confirmButton}>
											<button type="submit" disabled={isSubmitted}>
												<Text {...style.confirmText}>
													{withdrawCopy.confirm}
												</Text>
											</button>
										</Box>
									</Grid>
								</form>
							</Box>
						</VStack>
					</ResponsiveDialogBody>
				</ResponsiveDialogContent>
			</ResponsiveDialogPositioner>
		</>
	);
}
