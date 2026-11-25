package kr.jipsee.api.cors;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** jipsee.cors 설정. 허용 Origin 목록 */
@ConfigurationProperties("jipsee.cors")
public record CorsProperties(List<String> allowedOrigins) {}
