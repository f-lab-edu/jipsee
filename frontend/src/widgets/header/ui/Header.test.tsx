import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "@/widgets/header/ui/Header";

describe("Header", () => {
	it("모바일 헤더에 서비스 이름을 홈으로 가는 링크로 표시함", () => {
		render(<Header session={null} currentPath="/" />);

		expect(
			within(screen.getByTestId("header-mobile")).getByRole("link", {
				name: "집씨 홈",
			}),
		).toHaveProperty("pathname", "/");
	});

	it("데스크톱 헤더에도 같은 홈 링크를 표시함", () => {
		render(<Header session={null} currentPath="/" />);

		expect(
			within(screen.getByTestId("header-desktop")).getByRole("link", {
				name: "집씨 홈",
			}),
		).toHaveProperty("pathname", "/");
	});

	it("모바일 헤더 배경을 흰색으로 표시함", () => {
		render(<Header session={null} currentPath="/" />);

		const row = screen.getByTestId("header-mobile").firstElementChild;

		expect(row?.getAttribute("style")).toContain(
			"--seed-box-background: var(--seed-color-bg-layer-default)",
		);
	});

	it("모바일 헤더 아래에 1px 테두리와 그림자 클래스를 둠", () => {
		render(<Header session={null} currentPath="/" />);

		const row = screen.getByTestId("header-mobile").firstElementChild;

		expect(row?.getAttribute("style")).toContain(
			"--seed-box-border-bottom-width: 1px",
		);
		expect(row?.className).toContain("header-shadow");
	});

	it("모바일 헤더에 뒤로 가기 요소는 로고 줄에, 둘째 줄 요소는 그 아래에 표시함", () => {
		render(
			<Header
				session={null}
				currentPath="/"
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
		const { container } = render(<Header session={null} currentPath="/" />);
		const style = container.querySelector("header")?.getAttribute("style");

		expect(style).toContain("--seed-box-position: sticky");
		expect(style).toContain("--seed-box-top: 0");
	});

	it("currentPath가 없으면 데스크톱 헤더에 로그인 링크를 표시하지 않음", () => {
		render(<Header session={null} />);

		expect(screen.queryByRole("link", { name: "로그인" })).toBeNull();
	});

	it("currentPath가 있으면 데스크톱 헤더에만 로그인 링크를 표시함", () => {
		render(<Header session={null} currentPath="/" />);

		expect(
			within(screen.getByTestId("header-desktop")).getAllByRole("link", {
				name: "로그인",
			}),
		).toHaveLength(1);
		expect(
			within(screen.getByTestId("header-mobile")).queryByRole("link", {
				name: "로그인",
			}),
		).toBeNull();
	});
});
