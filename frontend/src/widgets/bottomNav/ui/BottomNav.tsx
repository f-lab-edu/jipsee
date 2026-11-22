"use client";

import { Box, HStack } from "@seed-design/react";
import { usePathname } from "next/navigation";
import type { Session } from "@/entities/session/model/session";
import { phase2RoutesEnabled } from "@/shared/config/phase2Routes";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { bottomNavStyles } from "@/widgets/bottomNav/config/bottomNavStyles";
import { bottomNavTabs } from "@/widgets/bottomNav/config/bottomNavTabs";
import BottomNavItem from "@/widgets/bottomNav/ui/BottomNavItem";

interface BottomNavProps {
	session: Nullable<Session>;
}

/**
 * 하단 내비게이션
 *
 * - 1280 미만에서만 보이고 화면 아래에 붙는 nav
 * - 홈, 집사, 내 정보 탭 출력
 * - 활성 탭은 현재 경로로 결정
 * - phase2RoutesEnabled가 false이면 출력하지 않음
 */
export default function BottomNav({ session }: BottomNavProps) {
	const pathname = usePathname() ?? "";
	const style = bottomNavStyles;

	if (!phase2RoutesEnabled) {
		return null;
	}

	return (
		<Box
			as="nav"
			aria-label="하단 내비게이션"
			data-area="bottom-nav"
			{...style.root}
		>
			<HStack as="ul" {...style.list}>
				{bottomNavTabs.map((tab) => (
					<BottomNavItem
						key={tab.id}
						tab={tab}
						pathname={pathname}
						session={session}
					/>
				))}
			</HStack>
		</Box>
	);
}
