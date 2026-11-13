"use client";

import { Box, type BoxProps } from "@seed-design/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { backButtonCopy } from "@/shared/config/backButtonCopy";

interface BackButtonProps {
	style: BoxProps;
	children: ReactNode;
}

/**
 * 뒤로 가기 버튼
 *
 * - 누르면 이전 화면으로 이동
 *
 * @param style 호출한 쪽이 정하는 버튼 모양
 */
export default function BackButton({ style, children }: BackButtonProps) {
	const router = useRouter();

	return (
		<Box asChild {...style}>
			<button
				type="button"
				aria-label={backButtonCopy.label}
				onClick={() => router.back()}
			>
				{children}
			</button>
		</Box>
	);
}
