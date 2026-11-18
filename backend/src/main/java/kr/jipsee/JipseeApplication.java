package kr.jipsee;

import java.util.TimeZone;
import kr.jipsee.global.common.TimeZones;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class JipseeApplication {
    private static final String BATCH_RUN_JOB = "jipsee.batch.run.job";

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone(TimeZones.SEOUL));
        ConfigurableApplicationContext context = SpringApplication.run(JipseeApplication.class, args);

        if (context.getEnvironment().containsProperty(BATCH_RUN_JOB)) {
            System.exit(SpringApplication.exit(context));
        }
    }
}
