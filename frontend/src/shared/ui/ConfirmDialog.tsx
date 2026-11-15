"use client";

import {
	ResponsiveDialogRoot,
	ResponsiveDialogTrigger,
	useBreakpointValue,
} from "@seed-design/react";
import type { ReactElement } from "react";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ConfirmDialogContent from "@/shared/ui/ConfirmDialogContent";

interface ConfirmDialogProps {
	trigger: ReactElement;
	title: string;
	description: string;
	confirmLabel: string;
	action: string;
	dataArea?: Nullable<string>;
}

/**
 * 확인 창
 *
 * - trigger를 누르면 확인 창 열기
 * - lg 미만은 바텀시트, lg 이상은 대화상자로 출력
 * - 화면 폭이 lg 경계를 넘으면 루트를 새로 만들어 열려 있던 창 닫기
 *
 * @param trigger 창을 여는 버튼 요소
 * @param action 확인 시 POST할 경로
 * @param dataArea 내용 요소에 붙일 data-area 값
 */
export default function ConfirmDialog({
	trigger,
	title,
	description,
	confirmLabel,
	action,
	dataArea = null,
}: ConfirmDialogProps) {
	const isBottomSheet = useBreakpointValue({ base: true, lg: false });

	return (
		<ResponsiveDialogRoot key={String(isBottomSheet)} dialogBreakpoint="lg">
			<ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>
			<ConfirmDialogContent
				title={title}
				description={description}
				confirmLabel={confirmLabel}
				action={action}
				dataArea={dataArea}
			/>
		</ResponsiveDialogRoot>
	);
}
