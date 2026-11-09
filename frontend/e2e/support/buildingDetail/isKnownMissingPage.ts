/** 아직 없는 /chat과 /policies/ 페이지인지. 미리 가져오다 나는 404를 걸러내는 데 씀 */
export function isKnownMissingPage(url: string) {
	try {
		const pathname = new URL(url).pathname;
		return pathname === "/chat" || pathname.startsWith("/policies/");
	} catch {
		return false;
	}
}
