/*
 * =========================================================
 * 팝업 24시간 localStorage 기능
 * =========================================================
 */

(() => {
  const POPUP_CLOSE_TIME_KEY = 'mov_popup_close_time';
  const POPUP_CLOSE_INTERVAL = 86400000; // 24시간 (ms)

  const popupOverlay = document.querySelector('[data-popup-overlay]');
  const popupBtnClose = document.querySelector('[data-popup-btn-close]');
  const popupBtnLater = document.querySelector('[data-popup-btn-later]');

  if (!popupOverlay || !popupBtnClose || !popupBtnLater) {
    return;
  }

  /**
   * 팝업 표시 여부 확인
   * 24시간 이내에 "24시간 이후에 보기"를 클릭했으면 false, 아니면 true
   */
  function shouldShowPopup() {
    const closeTime = localStorage.getItem(POPUP_CLOSE_TIME_KEY);
    
    if (!closeTime) {
      return true;
    }

    const closedAt = parseInt(closeTime, 10);
    const now = Date.now();
    const timePassed = now - closedAt;

    // 24시간 이상 지났으면 다시 표시
    return timePassed >= POPUP_CLOSE_INTERVAL;
  }

  /**
   * 팝업 닫기 (일반 닫기 - localStorage 저장 안함)
   */
  function closePopup() {
    popupOverlay.classList.remove('is-visible');
    popupOverlay.setAttribute('aria-hidden', 'true');
  }

  /**
   * 팝업 닫기 (24시간 이후에 보기 - localStorage 저장)
   */
  function closePopupWithDelay() {
    // 현재 시각을 localStorage에 저장
    localStorage.setItem(POPUP_CLOSE_TIME_KEY, String(Date.now()));
    
    popupOverlay.classList.remove('is-visible');
    popupOverlay.setAttribute('aria-hidden', 'true');
  }

  /**
   * 팝업 표시
   */
  function showPopup() {
    popupOverlay.classList.add('is-visible');
    popupOverlay.setAttribute('aria-hidden', 'false');
  }

  /**
   * 초기 로드 시 팝업 표시 여부 판단
   */
  if (shouldShowPopup()) {
    showPopup();
  }

  // 닫기 버튼 클릭 (24시간 제한 없음)
  popupBtnClose.addEventListener('click', closePopup);

  // "24시간 이후에 보기" 버튼 클릭
  popupBtnLater.addEventListener('click', closePopupWithDelay);

  // 배경 클릭 (overlay 클릭 감지) - 일반 닫기
  popupOverlay.addEventListener('click', (event) => {
    // container 영역 클릭 시 닫지 않음
    if (event.target === popupOverlay) {
      closePopup();
    }
  });
})();
