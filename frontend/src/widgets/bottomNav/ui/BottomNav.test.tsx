import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BottomNav from "@/widgets/bottomNav/ui/BottomNav";

const pathnameHolder = vi.hoisted(() => ({ value: "/" }));

vi.mock("next/navigation", () => ({
	usePathname: () => pathnameHolder.value,
}));

function renderAt(pathname: string, provider: "KAKAO" | null = null) {
	pathnameHolder.value = pathname;
	render(<BottomNav session={provider === null ? null : { provider }} />);

	return {
		home: screen.getByRole("link", { name: "홈" }),
		chat: screen.getByRole("link", { name: "집사" }),
		me: screen.getByRole("link", {
			name: provider === null ? "로그인" : "내 정보",
		}),
	};
}

describe("BottomNav", () => {
	it("로그인하면 하단 내비게이션 안에 홈, 집사, 내 정보 탭을 순서대로 표시함", () => {
		renderAt("/", "KAKAO");

		const nav = screen.getByRole("navigation", { name: "하단 내비게이션" });

		expect(
			Array.from(nav.querySelectorAll("a")).map((link) => link.textContent),
		).toEqual(["홈", "집사", "내 정보"]);
	});

	it("로그인하지 않으면 셋째 탭 이름이 로그인임", () => {
		renderAt("/");

		const nav = screen.getByRole("navigation", { name: "하단 내비게이션" });

		expect(
			Array.from(nav.querySelectorAll("a")).map((link) => link.textContent),
		).toEqual(["홈", "집사", "로그인"]);
	});

	it("홈에서는 홈 탭만 aria-current를 page로 가짐", () => {
		const tabs = renderAt("/");

		expect(tabs.home.getAttribute("aria-current")).toBe("page");
		expect(tabs.chat.hasAttribute("aria-current")).toBe(false);
		expect(tabs.me.hasAttribute("aria-current")).toBe(false);
	});

	it.each(["/search", "/buildings/1"])(
		"%s에서는 홈 탭이 aria-current를 true로 가짐",
		(pathname) => {
			const tabs = renderAt(pathname);

			expect(tabs.home.getAttribute("aria-current")).toBe("true");
			expect(tabs.chat.hasAttribute("aria-current")).toBe(false);
			expect(tabs.me.hasAttribute("aria-current")).toBe(false);
		},
	);

	it("내 정보에서는 내 정보 탭만 aria-current를 page로 가짐", () => {
		const tabs = renderAt("/me", "KAKAO");

		expect(tabs.me.getAttribute("aria-current")).toBe("page");
		expect(tabs.home.hasAttribute("aria-current")).toBe(false);
	});

	it("집사 화면에서는 정확히 같을 때 page, 하위 경로이면 true를 가짐", () => {
		expect(renderAt("/chat").chat.getAttribute("aria-current")).toBe("page");

		document.body.innerHTML = "";

		expect(renderAt("/chat/3").chat.getAttribute("aria-current")).toBe("true");
	});

	it.each(["/login", "/policies/terms"])(
		"%s에서는 활성 탭이 없음",
		(pathname) => {
			const tabs = renderAt(pathname);

			expect(
				[tabs.home, tabs.chat, tabs.me].filter((tab) =>
					tab.hasAttribute("aria-current"),
				),
			).toEqual([]);
		},
	);

	it("로그인하지 않으면 내 정보 탭이 로그인 경로로 이동함", () => {
		const tabs = renderAt("/");

		expect(tabs.me.getAttribute("href")).toBe("/login?next=%2Fme");
		expect(tabs.home.getAttribute("href")).toBe("/");
		expect(tabs.chat.getAttribute("href")).toBe("/chat");
	});

	it("로그인하면 내 정보 탭이 내 정보 경로로 이동함", () => {
		const tabs = renderAt("/", "KAKAO");

		expect(tabs.me.getAttribute("href")).toBe("/me");
	});
});
