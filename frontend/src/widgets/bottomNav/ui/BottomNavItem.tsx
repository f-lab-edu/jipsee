import { Box, Icon, Text } from "@seed-design/react";
import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { bottomNavStyles } from "@/widgets/bottomNav/config/bottomNavStyles";
import { toTabCurrent } from "@/widgets/bottomNav/lib/toTabCurrent";
import { toTabHref } from "@/widgets/bottomNav/lib/toTabHref";
import type { BottomNavTab } from "@/widgets/bottomNav/model/bottomNavTab";
import BottomNavTabIcon from "@/widgets/bottomNav/ui/BottomNavTabIcon";

interface BottomNavItemProps {
	tab: BottomNavTab;
	pathname: string;
	session: Nullable<Session>;
}

/**
 * 하단 내비게이션 > 탭
 *
 * - 현재 경로에 이어지는 탭이면 활성 색과 굵은 글씨로 출력
 * - 현재 경로와 탭 경로가 같을 때만 aria-current를 page로, 이어지는 경로이면 true로 지정
 * - 로그인하지 않았으면 내 정보 탭은 로그인 경로로 연결
 *
 * @param pathname 쿼리를 뺀 현재 경로
 */
export default function BottomNavItem({
	tab,
	pathname,
	session,
}: BottomNavItemProps) {
	const style = bottomNavStyles;
	const current = toTabCurrent(tab, pathname);
	const stateStyle = current === undefined ? style.inactive : style.active;

	return (
		<Box as="li" {...style.item}>
			<Box asChild {...style.link}>
				<Link
					href={toTabHref(tab, session)}
					aria-current={current}
					data-area={`bottom-nav-${tab.id}`}
				>
					<Icon
						svg={
							<BottomNavTabIcon
								id={tab.id}
								strokeWidth={stateStyle.strokeWidth}
							/>
						}
						{...stateStyle.icon}
					/>
					<Text {...stateStyle.label}>{tab.label}</Text>
				</Link>
			</Box>
		</Box>
	);
}
