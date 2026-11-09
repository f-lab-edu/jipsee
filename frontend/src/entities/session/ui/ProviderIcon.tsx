import { providerSymbols } from "@/entities/session/config/providerSymbols";
import type { Provider } from "@/entities/session/model/session";

interface ProviderIconProps {
	provider: Provider;
	size: number;
}

/**
 * 세션 > 로그인 제공자 심볼
 *
 * @param size 가로와 세로 픽셀 크기
 */
export default function ProviderIcon({ provider, size }: ProviderIconProps) {
	const symbol = providerSymbols[provider];

	return (
		<svg width={size} height={size} viewBox={symbol.viewBox} aria-hidden="true">
			{symbol.paths.map(({ d, fill }) => (
				<path key={d} d={d} fill={fill} />
			))}
		</svg>
	);
}
