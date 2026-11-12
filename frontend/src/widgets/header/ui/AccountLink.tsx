import { Box, Text } from "@seed-design/react";
import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";
import { accountLinkStyles } from "@/widgets/header/config/accountLinkStyles";

interface AccountLinkProps {
	session: Nullable<Session>;
	currentPath: string;
}

/**
 * 헤더 > 내 정보 영역
 *
 * - 로그인 시 내 정보 출력
 * - 현재 화면이 내 정보이면 aria-current를 page로 지정
 * - 비로그인 시 현재 경로를 돌아갈 경로로 담은 로그인 경로 출력
 *
 * - 데스크톱 헤더에서만 출력. 모바일과 태블릿은 하단 내비게이션의 내 정보 탭이 대신함
 *
 * @param currentPath 로그인 뒤 돌아올 현재 경로(쿼리 포함)
 */
export default function AccountLink({
	session,
	currentPath,
}: AccountLinkProps) {
	const style = accountLinkStyles;

	if (session) {
		return (
			<Box asChild {...style.box}>
				<Link
					href={paths.me}
					aria-current={currentPath === paths.me ? "page" : undefined}
				>
					<Text {...style.text}>내 정보</Text>
				</Link>
			</Box>
		);
	}

	return (
		<Box asChild {...style.box}>
			<Link href={paths.loginWithNext(currentPath)}>
				<Text {...style.text}>로그인</Text>
			</Link>
		</Box>
	);
}
