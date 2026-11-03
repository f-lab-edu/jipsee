import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

interface AccountLinkProps {
	session: Nullable<Session>;
}

/** 로그인했으면 내 정보 링크를, 아니면 로그인 링크를 표시함 */
export default function AccountLink({ session }: AccountLinkProps) {
	if (session) {
		return <Link href={paths.me}>내 정보</Link>;
	}

	return <Link href={paths.login}>로그인</Link>;
}
