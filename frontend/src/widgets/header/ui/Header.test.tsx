import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "@/widgets/header/ui/Header";

describe("Header", () => {
	it("모바일 헤더에 서비스 이름을 홈으로 가는 링크로 표시함", () => {
		render(
			<Header
				session={null}
				currentPath="/"
				mobileBackground="bg.layerDefault"
			/>,
		);

		expect(
			within(screen.getByTestId("header-mobile")).getByRole("link", {
				name: "집씨 홈",
			}),
		).toHaveProperty("pathname", "/");
	});

	it("데스크톱 헤더에도 같은 홈 링크를 표시함", () => {
		render(
			<Header
				session={null}
				currentPath="/"
				mobileBackground="bg.layerDefault"
			/>,
		);

		expect(
			within(screen.getByTestId("header-desktop")).getByRole("link", {
				name: "집씨 홈",
			}),
		).toHaveProperty("pathname", "/");
	});

	it("사용처가 넘긴 배경 색을 모바일 헤더에 적용함", () => {
		render(
			<Header session={null} currentPath="/" mobileBackground="bg.brandWeak" />,
		);

		const row = screen.getByTestId("header-mobile").firstElementChild;

		expect(row?.getAttribute("style")).toContain(
			"--seed-box-background: var(--seed-color-bg-brand-weak)",
		);
	});

	it("모바일 헤더에 뒤로 가기 요소는 로고 줄에, 둘째 줄 요소는 그 아래에 표시함", () => {
		render(
			<Header
				session={null}
				currentPath="/"
				mobileBackground="transparent"
				mobileBack={<button type="button">뒤로</button>}
				mobileBottom={<p>둘째 줄</p>}
			/>,
		);

		const mobile = within(screen.getByTestId("header-mobile"));
		const back = mobile.getByRole("button", { name: "뒤로" });
		const logo = mobile.getByRole("link", { name: "집씨 홈" });
		const bottom = mobile.getByText("둘째 줄");

		expect(
			back.compareDocumentPosition(logo) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			logo.compareDocumentPosition(bottom) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			within(screen.getByTestId("header-desktop")).queryByText("뒤로"),
		).toBeNull();
	});

	it("헤더 요소를 위 0에 고정함", () => {
		const { container } = render(
			<Header
				session={null}
				currentPath="/"
				mobileBackground="bg.layerDefault"
			/>,
		);
		const style = container.querySelector("header")?.getAttribute("style");

		expect(style).toContain("--seed-box-position: sticky");
		expect(style).toContain("--seed-box-top: 0");
	});

	it("계정 링크를 숨기면 모바일과 데스크톱 헤더에 로그인 링크를 표시하지 않음", () => {
		render(
			<Header
				session={null}
				currentPath="/login"
				mobileBackground="bg.layerDefault"
				hidesAccountLink
			/>,
		);

		expect(screen.queryByRole("link", { name: "로그인" })).toBeNull();
	});

	it("계정 링크를 숨기지 않으면 모바일과 데스크톱 헤더에 로그인 링크를 표시함", () => {
		render(
			<Header
				session={null}
				currentPath="/"
				mobileBackground="bg.layerDefault"
			/>,
		);

		expect(screen.getAllByRole("link", { name: "로그인" })).toHaveLength(2);
	});
});
