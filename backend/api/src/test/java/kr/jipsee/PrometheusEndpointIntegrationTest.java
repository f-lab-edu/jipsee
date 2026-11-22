package kr.jipsee;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalManagementPort;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.client.RestTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class PrometheusEndpointIntegrationTest {

    @Autowired
    RestTestClient restTestClient;

    @LocalServerPort
    int serverPort;

    @LocalManagementPort
    int managementPort;

    @Test
    @DisplayName("요청을 한 번 보낸 뒤 /actuator/prometheus를 조회하면 application 태그와 http 요청 히스토그램을 반환함")
    void 요청을_한_번_보낸_뒤_actuator_prometheus를_조회하면_application_태그와_http_요청_히스토그램을_반환함() {
        // given
        restTestClient
                .get()
                .uri(URI.create("http://localhost:" + serverPort + "/no-such-path"))
                .exchange();
        restTestClient
                .get()
                .uri(URI.create("http://localhost:" + managementPort + "/actuator/health"))
                .exchange()
                .expectStatus()
                .isOk();

        // when
        var response = restTestClient
                .get()
                .uri(URI.create("http://localhost:" + managementPort + "/actuator/prometheus"))
                .exchange();

        // then
        response.expectStatus().isOk();
        String body = response.expectBody(String.class).returnResult().getResponseBody();
        assertThat(body).contains("application=\"jipsee\"").contains("http_server_requests_seconds_bucket");
    }
}
