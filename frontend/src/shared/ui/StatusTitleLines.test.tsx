import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatusTitleLines from "@/shared/ui/StatusTitleLines";

describe("StatusTitleLines", () => {
	it("여러 줄이면 줄 사이에 줄바꿈을 넣고 글자만 읽으면 한 문장이 됨", () => {
		const { container } = render(
			<p>
				<StatusTitleLines
					lines={["요청이 많아요.", "잠시 후 다시 시도해 주세요"]}
				/>
			</p>,
		);

		expect(container.querySelectorAll("br")).toHaveLength(1);
		expect(container.textContent).toBe(
			"요청이 많아요. 잠시 후 다시 시도해 주세요",
		);
	});

	it("한 줄이면 줄바꿈이 없음", () => {
		const { container } = render(
			<p>
				<StatusTitleLines lines={["일시적인 오류가 발생했어요"]} />
			</p>,
		);

		expect(container.querySelectorAll("br")).toHaveLength(0);
	});
});
