package kr.jipsee.batch.deal;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import kr.jipsee.TestcontainersConfiguration;
import kr.jipsee.deal.dto.DealKey;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.step.ListableStepLocator;
import org.springframework.batch.infrastructure.item.ExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

/** 이름이 바뀌면 Spring Batch가 기존 Job 인스턴스를 찾지 못하므로 이름을 고정하는 테스트 */
@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
class DealJobNamesTest {

    @Autowired
    Map<String, Job> jobs;

    @Test
    @DisplayName("등록된 Job 이름이 옛 이름 그대로임")
    void 등록된_Job_이름이_옛_이름_그대로임() {
        assertThat(jobs.values().stream().map(Job::getName).collect(Collectors.toSet()))
                .containsAll(List.of(
                        "dailyRentCollectJob", "dailySaleCollectJob", "initialRentLoadJob", "initialSaleLoadJob"));
    }

    @Test
    @DisplayName("각 Job의 Step 이름이 옛 이름 그대로이고 순서도 같음")
    void 각_Job의_Step_이름이_옛_이름_그대로이고_순서도_같음() {
        assertThat(stepNames("dailyRentCollectJob")).containsExactly("dailyRentStep", "rentLoadedAtStep");
        assertThat(stepNames("dailySaleCollectJob")).containsExactly("dailySaleStep", "saleLoadedAtStep");
        assertThat(stepNames("initialRentLoadJob")).containsExactly("initialRentStep", "rentLoadedAtStep");
        assertThat(stepNames("initialSaleLoadJob")).containsExactly("initialSaleStep", "saleLoadedAtStep");
    }

    @Test
    @DisplayName("Reader가 저장하는 ExecutionContext 키가 옛 키 그대로임")
    void Reader가_저장하는_ExecutionContext_키가_옛_키_그대로임() throws Exception {
        DealKeyReader reader = new DealKeyReader(
                List.of(new DealKey("11110", YearMonth.of(2026, 10)), new DealKey("11140", YearMonth.of(2026, 10))));
        ExecutionContext context = new ExecutionContext();

        reader.open(context);
        reader.read();
        reader.read();
        reader.update(context);

        assertThat(context.containsKey("dealKeyReader.read.count")).isTrue();
        assertThat(context.getInt("dealKeyReader.read.count")).isEqualTo(2);
    }

    @Test
    @DisplayName("식별 파라미터 이름이 옛 이름 그대로임")
    void 식별_파라미터_이름이_옛_이름_그대로임() {
        assertThat(DealJobConfig.PARAM_COLLECT_DATE).isEqualTo("collectDate");
        assertThat(DealJobConfig.PARAM_END_MONTH).isEqualTo("endMonth");
    }

    private List<String> stepNames(String jobName) {
        Job job = jobs.values().stream()
                .filter(candidate -> candidate.getName().equals(jobName))
                .findFirst()
                .orElseThrow();
        return List.copyOf(((ListableStepLocator) job).getStepNames());
    }
}
