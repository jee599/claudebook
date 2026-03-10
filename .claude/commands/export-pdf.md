# Export Agent — PDF + WikiDocs 내보내기

$ARGUMENTS: [권번호] (예: `1` → 1권 전체 내보내기)

## 역할
완성된 챕터를 모아 PDF 및 WikiDocs 업로드용 포맷으로 변환

## 실행 순서
1. `ko/book[권]/index.md` 에서 챕터 순서 확인
2. `[ko검수완료]` 상태인 챕터만 포함
3. 챕터 파일들을 순서대로 합쳐 `export/book[권]_ko_draft.md` 생성
4. pandoc으로 PDF 변환:
   ```bash
   pandoc export/book[권]_ko_draft.md \
     -o export/book[권]_ko.pdf \
     --pdf-engine=xelatex \
     -V mainfont="Apple SD Gothic Neo" \
     -V geometry:margin=2.5cm \
     --toc --toc-depth=2
   ```
5. WikiDocs 업로드용으로 챕터별 파일 `export/wikidocs/ko/` 에 복사
6. 이미지 경로를 WikiDocs 형식으로 변환

## WikiDocs 포맷 규칙
- 이미지: `![설명](이미지URL)` 형식 유지
- 코드 블록: ` ``` ` 형식 유지 (WikiDocs 마크다운 호환)
- 내부 링크: WikiDocs 챕터 번호 기반으로 변환

## 사전 요구사항
```bash
# pandoc 설치 확인
pandoc --version

# 한국어 PDF용 폰트 확인 (macOS)
fc-list | grep "Apple SD Gothic"
```
