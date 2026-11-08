import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NearbyDealContractChip from "@/entities/building/ui/NearbyDealContractChip";

describe("NearbyDealContractChip", () => {
	it("계약 구분이 없으면 칩을 출력하지 않음", () => {
		const { container } = render(
			<NearbyDealContractChip contract={null} layout="mobile" />,
		);

		expect(container.firstChild).toBeNull();
	});
});
