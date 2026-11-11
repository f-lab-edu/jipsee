import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChatPanelMobile from "@/features/askChatbot/ui/ChatPanelMobile";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe.each(["expanded", "compact"] as const)(
	"ChatPanelMobile %s",
	(layout) => {
		it("세션이 없으면 /login으로 가는 로그인하고 이용하기 링크를 표시함", () => {
			render(<ChatPanelMobile session={null} layout={layout} />);

			const link = screen.getByRole("link", { name: "로그인하고 이용하기" });

			expect(link).toHaveProperty("pathname", "/login");
			expect(link.getAttribute("href")).toBe("/login?next=%2Fchat");
		});

		it("세션이 있으면 /chat으로 가는 지난 대화 링크와 질문 입력을 표시하고 로그인하고 이용하기 링크는 표시하지 않음", () => {
			render(
				<ChatPanelMobile session={{ provider: "GOOGLE" }} layout={layout} />,
			);

			expect(screen.getByRole("link", { name: "지난 대화" })).toHaveProperty(
				"pathname",
				"/chat",
			);
			expect(
				screen.getByRole("textbox", { name: "집사에게 질문" }),
			).toBeTruthy();
			expect(screen.queryByText("로그인하고 이용하기")).toBeNull();
		});
	},
);
