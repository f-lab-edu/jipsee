import { describe, expect, it } from "vitest";
import { toClauseId } from "@/pages/policy/lib/toClauseId";

describe("toClauseId", () => {
	it("순번과 화면 크기를 담은 id를 반환함", () => {
		expect(toClauseId("mobile", 3)).toBe("clause-3-mobile");
		expect(toClauseId("desktop", 10)).toBe("clause-10-desktop");
	});
});
