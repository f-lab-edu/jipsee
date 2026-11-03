package kr.jipsee;

import static org.assertj.core.api.Assertions.assertThat;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class JipseeApplicationTests {

    @Autowired
    private Flyway flyway;

    @Test
    @DisplayName("스키마를 적용한 MySQL로 애플리케이션 컨텍스트를 불러옴")
    void 스키마를_적용한_MySQL로_애플리케이션_컨텍스트를_불러옴() {
        assertThat(flyway.info().applied()).isNotEmpty();
    }
}
