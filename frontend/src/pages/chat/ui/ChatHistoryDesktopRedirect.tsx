"use client";

import { useBreakpointValue } from "@seed-design/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { paths } from "@/shared/routes/paths";

/**
 * 채팅 > 대화 목록 데스크톱 이동
 *
 * - 화면 폭이 1280 이상이면 대화 목록 레일이 있는 /chat으로 이동
 * - 화면에 아무것도 그리지 않음
 */
export default function ChatHistoryDesktopRedirect() {
	const router = useRouter();
	const isDesktop = useBreakpointValue({ base: false, lg: true });

	useEffect(() => {
		if (isDesktop) {
			router.replace(paths.chat);
		}
	}, [isDesktop, router]);

	return null;
}
