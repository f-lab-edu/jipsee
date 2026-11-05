package kr.jipsee;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class BatchSettingsTest {

    @Autowired
    Environment environment;

    @Autowired
    JobRepository jobRepository;

    @Test
    @DisplayName("애플리케이션을 시작할 때 Job을 자동으로 실행하지 않도록 설정함")
    void 애플리케이션을_시작할_때_Job을_자동으로_실행하지_않도록_설정함() {
        assertThat(environment.getProperty("spring.batch.job.enabled")).isEqualTo("false");
    }

    @Test
    @DisplayName("BATCH 메타데이터 스키마를 자동으로 만들지 않도록 설정함")
    void BATCH_메타데이터_스키마를_자동으로_만들지_않도록_설정함() {
        assertThat(environment.getProperty("spring.batch.jdbc.initialize-schema"))
                .isEqualTo("never");
    }

    @Test
    @DisplayName("외부 스키마로 만든 BATCH 메타데이터 테이블에서 실행 기록을 조회함")
    void 외부_스키마로_만든_BATCH_메타데이터_테이블에서_실행_기록을_조회함() {
        assertThat(jobRepository.findRunningJobExecutions("noSuchJob")).isEmpty();
    }
}
