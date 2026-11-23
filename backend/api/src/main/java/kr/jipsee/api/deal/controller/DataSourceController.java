package kr.jipsee.api.deal.controller;

import java.util.List;
import kr.jipsee.api.deal.dto.DataSourceResponse;
import kr.jipsee.deal.service.CollectStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** 데이터 출처별 기준 월 조회 */
@RestController
@RequiredArgsConstructor
public class DataSourceController {

    private final CollectStatusService collectStatusService;

    /** 출처별 기준 월 조회 */
    @GetMapping("/data-sources")
    public List<DataSourceResponse> getDataSources() {
        return collectStatusService.findAll().stream()
                .map(DataSourceResponse::from)
                .toList();
    }
}
