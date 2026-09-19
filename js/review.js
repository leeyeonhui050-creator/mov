// MOV REAL REVIEW - Google Sheets 연동
// 1) 아래 API_URL에 배포한 Google Apps Script 웹앱 URL을 넣으십시오.
const MOV_REVIEW_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

async function loadReviews() {
  const reviewList = document.querySelector('#review-list');
  if (!reviewList) return;

  if (!MOV_REVIEW_API_URL || MOV_REVIEW_API_URL.includes('YOUR_')) {
    reviewList.innerHTML = '<p class="review__empty">리뷰를 불러올 준비 중입니다.</p>';
    return;
  }

  try {
    const response = await fetch(MOV_REVIEW_API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Review API: ${response.status}`);

    const result = await response.json();
    if (!result.success || !Array.isArray(result.reviews)) {
      throw new Error('Invalid review response');
    }

    if (!result.reviews.length) {
      reviewList.innerHTML = '<p class="review__empty">아직 등록된 리뷰가 없습니다.</p>';
      return;
    }

    reviewList.innerHTML = result.reviews.map((review) => `
      <article class="review-card">
        <span class="review-card__label">[REAL REVIEW]</span>
        <p class="review-card__text">“${escapeHtml(review.text)}”</p>
        <footer>${escapeHtml(review.name || 'CLIENT')}${review.date ? ` / ${escapeHtml(review.date)}` : ''}</footer>
      </article>
    `).join('');
  } catch (error) {
    console.error('MOV reviews failed to load.', error);
    reviewList.innerHTML = '<p class="review__empty">리뷰를 불러오지 못했습니다.</p>';
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('componentsloaded', loadReviews);
