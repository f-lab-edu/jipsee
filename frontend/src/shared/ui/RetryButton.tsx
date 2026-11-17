"use client";

import { Box, type BoxProps, Text, type TextProps } from "@seed-design/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { statusActionCopy } from "@/shared/config/statusCopy";

interface RetryButtonProps {
	style: BoxProps;
	textStyle: TextProps;
	reset?: () => void;
}

/**
 * 공통 > 다시 시도 버튼
 *
 * - 누르면 서버에서 가져온 데이터를 다시 요청하고, 오류 경계의 reset이 있으면 함께 호출
 * - 다시 요청하는 동안 비활성화하고 aria-busy 지정
 *
 * @param style 호출한 쪽이 정하는 버튼 모양
 * @param textStyle 호출한 쪽이 정하는 글자 모양
 * @param reset 오류 경계(error.tsx)가 넘겨 주는 복구 함수
 */
export default function RetryButton({
	style,
	textStyle,
	reset,
}: RetryButtonProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function retry() {
		startTransition(() => {
			router.refresh();
			reset?.();
		});
	}

	return (
		<Box asChild {...style}>
			<button
				type="button"
				aria-busy={isPending}
				disabled={isPending}
				onClick={retry}
			>
				<Text {...textStyle}>{statusActionCopy.retry}</Text>
			</button>
		</Box>
	);
}
