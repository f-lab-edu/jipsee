package kr.jipsee.global.publicdata;

import static org.assertj.core.api.Assertions.assertThat;

import kr.jipsee.TestcontainersConfiguration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestClient;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class PublicDataConfigTest {

    @Autowired
    PublicDataProperties properties;

    @Autowired
    Environment environment;

    @Autowired
    RestClient publicDataRestClient;

    @Autowired
    RetryTemplate publicDataRetryTemplate;

    @Test
    @DisplayName("공공데이터 설정 값을 새 키에서 읽음")
    void 공공데이터_설정_값을_새_키에서_읽음() {
        assertThat(properties.api().baseUrl()).isEqualTo("https://apis.data.go.kr/1613000");
        assertThat(properties.api().serviceKey()).isEqualTo("test-service-key");
    }

    @Test
    @DisplayName("옛 설정 키는 남지 않음")
    void 옛_설정_키는_남지_않음() {
        assertThat(environment.getProperty("jipsee.collect.api.base-url")).isNull();
        assertThat(environment.getProperty("jipsee.collect.api.service-key")).isNull();
    }

    @Test
    @DisplayName("설정 객체를 문자열로 바꿔도 서비스 키가 나오지 않음")
    void 설정_객체를_문자열로_바꿔도_서비스_키가_나오지_않음() {
        assertThat(properties.api().toString()).doesNotContain("test-service-key");
        assertThat(properties.toString()).doesNotContain("test-service-key");
    }

    @Test
    @DisplayName("호출용 빈이 컨텍스트에 있음")
    void 호출용_빈이_컨텍스트에_있음() {
        assertThat(publicDataRestClient).isNotNull();
        assertThat(publicDataRetryTemplate).isNotNull();
    }
}
