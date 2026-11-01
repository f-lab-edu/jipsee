import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

interface AccountLinkProps {
	session: Nullable<Session>;
}

export default function AccountLink({ session }: AccountLinkProps) {
	if (session) {
		return <Link href={paths.me}>내 정보</Link>;
	}

	return <Link href={paths.login}>로그인</Link>;
}
