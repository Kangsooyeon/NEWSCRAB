package com.gihojise.newscrab.controller;

import com.gihojise.newscrab.dto.common.ApiResponse;
import com.gihojise.newscrab.dto.request.VocaAddRequestDto;
import com.gihojise.newscrab.dto.response.VocaListResponseDto;
import com.gihojise.newscrab.dto.response.VocaNewsResponseDto;
import com.gihojise.newscrab.dto.response.VocaResponseDto;
import com.gihojise.newscrab.service.VocaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/voca")
@RequiredArgsConstructor
@Tag(name = "Voca Controller", description = "단어 관리 API") // 컨트롤러 설명 추가
public class VocaController {

    private final VocaService vocaService;

    // 1. 단어 목록 조회
    @Operation(summary = "단어 목록 조회", description = "등록된 모든 단어 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<VocaListResponseDto>> getVocaList() {
        VocaListResponseDto response = vocaService.getVocaList();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), "단어 목록 조회 성공", response));
    }

    // 2. 단어 상세 조회
    @Operation(summary = "단어 상세 조회", description = "단어 ID로 단어 상세 정보를 조회합니다.")
    @GetMapping("/{termId}")
    public ResponseEntity<ApiResponse<VocaResponseDto>> getVocaDetail(@PathVariable int termId) {
        VocaResponseDto response = vocaService.getVocaDetail(termId);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), "단어 상세 조회 성공", response));
    }

    // 3. 단어 추가
    @Operation(summary = "단어 추가", description = "단어를 추가합니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addVoca(@RequestParam int userId, @RequestBody VocaAddRequestDto vocaAddRequestDto) {
        vocaService.addVoca(vocaAddRequestDto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(HttpStatus.CREATED.value(), HttpStatus.CREATED.getReasonPhrase(), "단어 추가 성공", null));
    }

    // 4. 단어 수정
    @Operation(summary = "단어 수정", description = "단어를 수정합니다.")
    @PutMapping("/{termId}")
    public ResponseEntity<ApiResponse<Void>> updateVoca(@RequestParam int userId, @PathVariable int termId, @RequestBody VocaAddRequestDto vocaAddRequestDto) {
        vocaService.updateVoca(userId, termId, vocaAddRequestDto);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), "단어 수정 성공", null));
    }

    // 5. 단어 삭제
    @Operation(summary = "단어 삭제", description = "단어를 삭제합니다.")
    @DeleteMapping("/{termId}")
    public ResponseEntity<ApiResponse<Void>> deleteVoca(@RequestParam int userId, @PathVariable int termId) {
        vocaService.deleteVoca(userId, termId);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), "단어 삭제 성공", null));
    }


    // 내부 호출 API
    // 단어 연관 뉴스 추천
    @Operation(summary = "단어 연관 뉴스 추천", description = "단어와 연관된 뉴스를 추천합니다.")
    @GetMapping("/{keyword}/news")
    public ResponseEntity<ApiResponse<VocaNewsResponseDto>> recommendNews(@PathVariable String keyword) {
        VocaNewsResponseDto response = vocaService.fetchRelatedNews(keyword);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), HttpStatus.OK.getReasonPhrase(), "단어 연관 뉴스 추천 성공", response));
    }

}