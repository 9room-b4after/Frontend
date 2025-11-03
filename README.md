# 구름톤 서북지구 팀 프로젝트 : 숲결 🌿


<br><br>

## 👨‍👨‍👧 B4AFTER 팀 소개

|                                                               FE                                                                |                                       BE                                        |                                        BE                                         |                                       BE                                        |                                       BE                                        |                                                             
|:-------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------:|
| <img src="https://avatars.githubusercontent.com/u/175408359?v=4" width="160"/>  | <img src="https://avatars.githubusercontent.com/u/75060858?s=400&u=4917b902ce67c045926c2dcc84052a307ef7b615&v=4" width="160" /> |  <img src="https://avatars.githubusercontent.com/u/163461154?v=4" width="160">  |  <img src="https://avatars.githubusercontent.com/u/127640204?v=4" width="160" />  | <img src="https://avatars.githubusercontent.com/u/158552165?v=4" width="160" />|  
|                                       김민주                                       |                                                                윤민섭                                                               |                                       김혜림                                       |                                        박채연                                        |                                       박세웅                                       |
|                   [calla1102](https://github.com/calla1102)                   |                  [Minsub](https://github.com/minsubyun1)                                             |                  [kimhyerim01](https://github.com/kimhyerim01)                  |                  [yeonchaepark](https://github.com/yeonchaepark)                  |                    [hardwoong](https://github.com/hardwoong)                    |

# 🌿 숲결 (Soopgyeol) — Frontend

> 개인의 소비 습관을 분석하고, 한눈에 볼 수 있는 월간 리포트를 제공하는 재정 관리 서비스  
> React Native (Expo) 기반으로 개발된 모바일 앱 프론트엔드입니다.

---

## 🧭 프로젝트 개요

**숲결**은 사용자의 월별 지출 데이터를 시각적으로 분석해  
금융 점수(Financial Score), 소비 패턴, 카테고리별 통계 등을 한눈에 보여주는 **AI 기반 개인 자산 리포트 서비스**입니다.  

프론트엔드는 React Native를 활용해 개발되었으며,  
다양한 API를 연동하면서 **데이터 시각화**, **상태 관리**, **오류 처리**, **UI 최적화**에 중점을 두었습니다.

---

## ⚙️ 기술 스택

| 구분 | 기술 |
|------|------|
| **Framework** | React Native (Expo) |
| **Language** | TypeScript |
| **State Management** | React Hooks, Context API |
| **API 연동** | Fetch API |
| **Build/Deploy** | Expo CLI, EAS Build |
| **Version Control** | Git, GitHub |
| **Design Reference** | Figma |

---

## ✨ 주요 기능

- **월간 지출 리포트**: 카테고리별, 항목별 총 지출 및 소비 비율 표시  
- **Financial Score 시각화**: API 응답 데이터를 바탕으로 사용자 금융 점수 출력  
- **API 연동 기반 데이터 처리**: 백엔드의 요약 리포트 API를 호출하여 화면별 상태 반영  
- **사용자 맞춤 UI**: 단순한 금액 표시가 아닌 시각적 구성 중심의 UI 설계  
- **에러 핸들링 강화**: 응답 오류, 토큰 문제, 네트워크 지연 상황에 대응 로직 구현  

---

## 🔧 개발 과정 및 문제 해결

### 1. 다양한 API 연동 및 상태 관리
- 각 화면에서 여러 API를 동시에 호출해야 하는 구조를 효율적으로 관리하기 위해  
  `useEffect`와 `Context API`를 활용해 **데이터 흐름을 통합 관리**했습니다.
- API 응답 구조를 **콘솔 로그로 수시로 확인**하며 실제 데이터 흐름을 검증했습니다.

### 2. API 오류 및 구조 개선
- 일부 API에서 예상치 못한 에러가 빈번히 발생하여,  
  **Swagger 문서**와 **Notion API 명세**를 비교하며 구조를 재정리했습니다.
- 필요한 경우 **백엔드 팀과 직접 커뮤니케이션**을 통해 API 명세를 수정하거나 요청 구조를 통일했습니다.

### 3. 디버깅 및 개선 과정
- 오류 발생 시 단순 수정보다 **응답 구조 분석 → 문제 원인 파악 → 개선 반영** 절차를 반복했습니다.
- 불안정한 API 호출 구간은 별도 헬퍼 함수로 모듈화하여 유지보수를 용이하게 했습니다.

---

## 🤝 협업 프로세스

- **Git 브랜치 전략**으로 기능 단위 개발 및 PR 기반 병합 진행  
- **Notion**을 활용하여 API 명세 및 개발 일정 공유  
- **Swagger** 문서를 참조하며 백엔드와 인터페이스 일치성 점검  
- **Figma 디자인 시안**을 기반으로 UI/UX 구현  

---

## 💡 배운 점

- API 명세와 실제 데이터 간의 불일치가 개발 효율에 큰 영향을 준다는 점을 체감  
- 단순 오류 수정이 아닌 **구조적 문제 해결 접근법**을 익힘  
- 백엔드와의 커뮤니케이션이 프론트엔드 개발 완성도를 높인다는 점을 경험  

---

## 📱 실행 방법

```bash
# 의존성 설치
npm install

# Expo 실행
npx expo start
