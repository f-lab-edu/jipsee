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
import { confirmDialogCopy } from "@/shared/config/confirmDialogCopy";
import { confirmDialogStyles } from "@/shared/config/confirmDialogStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ConfirmDialogContentProps {
	title: string;
	description: string;
	confirmLabel: string;
	action: string;
	dataArea: Nullable<string>;
}

/**
 * 확인 창 > 내용
 *
 * - 제목, 설명, 취소와 확인 버튼 출력
 * - 취소는 창 닫기
 * - 확인은 action 경로로 POST하는 폼의 제출 버튼이며 닫기 동작으로 감싸지 않음
 * - 폼을 제출하면 확인 버튼을 비활성화해 중복 요청 방지
 *
 * @param action 확인 시 POST할 경로
 * @param dataArea 내용 요소에 붙일 data-area 값
 */
export default function ConfirmDialogContent({
	title,
	description,
	confirmLabel,
	action,
	dataArea,
}: ConfirmDialogContentProps) {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const style = confirmDialogStyles;

	return (
		<>
			<ResponsiveDialogBackdrop />
			<ResponsiveDialogPositioner>
				<ResponsiveDialogContent
					className={style.contentClassName}
					data-area={dataArea ?? undefined}
				>
					<ResponsiveDialogHandle />
					<ResponsiveDialogBody>
						<VStack {...style.body}>
							<ResponsiveDialogTitle asChild>
								<Text as="h2" {...style.title}>
									{title}
								</Text>
							</ResponsiveDialogTitle>
							<ResponsiveDialogDescription asChild>
								<Text as="p" {...style.description}>
									{description}
								</Text>
							</ResponsiveDialogDescription>
							<Box asChild {...style.form}>
								<form
									method="post"
									action={action}
									onSubmit={() => setIsSubmitted(true)}
								>
									<Grid {...style.buttons}>
										<ResponsiveDialogAction asChild>
											<Box asChild {...style.cancelButton}>
												<button type="button">
													<Text {...style.cancelText}>
														{confirmDialogCopy.cancel}
													</Text>
												</button>
											</Box>
										</ResponsiveDialogAction>
										<Box asChild {...style.confirmButton}>
											<button type="submit" disabled={isSubmitted}>
												<Text {...style.confirmText}>{confirmLabel}</Text>
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
