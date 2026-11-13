import type { Locator } from "@playwright/test";

/** 첫 요소의 계산된 스타일 값을 읽어 속성 이름별로 반환함 */
export async function readStyle<Key extends string>(
	locator: Locator,
	properties: readonly Key[],
): Promise<Record<Key, string>> {
	return locator.first().evaluate((element, names) => {
		const computed = getComputedStyle(element);
		return Object.fromEntries(
			names.map((name) => [name, computed.getPropertyValue(name)]),
		);
	}, properties) as Promise<Record<Key, string>>;
}
