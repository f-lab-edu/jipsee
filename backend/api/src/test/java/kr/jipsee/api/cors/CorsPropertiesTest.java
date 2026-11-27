package kr.jipsee.api.cors;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;

class CorsPropertiesTest {

    private final ApplicationContextRunner contextRunner =
            new ApplicationContextRunner().withUserConfiguration(TestConfig.class);

    @Configuration
    @EnableConfigurationProperties(CorsProperties.class)
    static class TestConfig {}

    @Test
    @DisplayName("allowed-origins가 있으면 컨텍스트 기동 성공")
    void allowed_origins가_있으면_컨텍스트_기동_성공() {
        contextRunner
                .withPropertyValues("jipsee.cors.allowed-origins=https://jipsee.link")
                .run(context -> {
                    assertThat(context).hasNotFailed();
                    assertThat(context.getBean(CorsProperties.class).allowedOrigins())
                            .containsExactly("https://jipsee.link");
                });
    }

    @Test
    @DisplayName("allowed-origins가 누락되면 컨텍스트 기동 실패")
    void allowed_origins가_누락되면_컨텍스트_기동_실패() {
        contextRunner.run(context -> assertThat(context).hasFailed());
    }

    @Test
    @DisplayName("allowed-origins가 비어 있으면 컨텍스트 기동 실패")
    void allowed_origins가_비어_있으면_컨텍스트_기동_실패() {
        contextRunner
                .withPropertyValues("jipsee.cors.allowed-origins=")
                .run(context -> assertThat(context).hasFailed());
    }
}
