package kr.jipsee.api.cors;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** jipsee.cors 설정. 허용 Origin 목록 */
@Validated
@ConfigurationProperties("jipsee.cors")
public record CorsProperties(@NotEmpty List<String> allowedOrigins) {}
