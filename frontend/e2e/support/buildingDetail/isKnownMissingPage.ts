/** 아직 없는 /chat 페이지인지. 미리 가져오다 나는 404를 걸러내는 데 씀 */
export function isKnownMissingPage(url: string) {
	try {
		return new URL(url).pathname === "/chat";
	} catch {
		return false;
	}
}
