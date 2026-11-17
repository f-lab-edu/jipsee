import type { Metadata } from "next";
import { getSession } from "@/entities/session/api/getSession";
import StatusScreen from "@/pages/status/ui/StatusScreen";
import { statusCopy } from "@/shared/config/statusCopy";

export const metadata: Metadata = {
	title: statusCopy.notFound.titleLines.join(" "),
};

/**
 * 404 > 페이지
 *
 * - 없는 주소와 notFound()를 던진 화면에서 헤더, 푸터, 하단 내비게이션을 둔 404 화면 출력
 */
export default async function NotFound() {
	const session = await getSession();

	return <StatusScreen kind="notFound" session={session} />;
}
