import { Box, Text } from "@seed-design/react";
import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import { paths } from "@/shared/routes/paths";
import { accountLinkStyles } from "@/widgets/header/config/accountLinkStyles";

interface AccountLinkProps {
	session: Nullable<Session>;
	variant: ResponsiveVariant;
	currentPath: string;
}

/**
 * 헤더 > 내 정보 영역
 *
 * - 로그인 시 내 정보 출력
 * - 비로그인 시 현재 경로를 돌아갈 경로로 담은 로그인 경로 출력
 *
 * @param variant 모바일은 텍스트 링크, 데스크톱은 외곽선 버튼 모양
 * @param currentPath 로그인 뒤 돌아올 현재 경로(쿼리 포함)
 */
export default function AccountLink({
	session,
	variant,
	currentPath,
}: AccountLinkProps) {
	const style = accountLinkStyles[variant];

	if (session) {
		return (
			<Box asChild {...style.box}>
				<Link href={paths.me}>
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
