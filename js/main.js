/*
 * =========================================================
 * MOV MAIN JS
 * =========================================================
 */


/*
 * =========================================================
 * GOOGLE SHEETS REVIEW API
 * =========================================================
 */

const REVIEW_API_URL =
  'https://script.google.com/macros/s/AKfycbwxrf2YfGqnSOJoWEHBdttVuUFF1RlWSY0ZbPvSRCHiy_ADEqbUxv6QYbGanI_gfYj5GA/exec';



/*
 * =========================================================
 * COMPONENTS LOADED
 * =========================================================
 */

document.addEventListener('componentsloaded', () => {

  /*
   * =======================================================
   * 모바일 메뉴
   * =======================================================
   */

  const menuToggle =
    document.querySelector('[data-menu-toggle]');

  const menuPanel =
    document.querySelector('[data-menu-panel]');


  if (menuToggle && menuPanel) {

    menuToggle.addEventListener('click', () => {

      const isOpen =
        menuToggle.getAttribute('aria-expanded') === 'true';


      menuToggle.setAttribute(
        'aria-expanded',
        String(!isOpen)
      );


      menuPanel.classList.toggle(
        'is-open',
        !isOpen
      );

    });


    menuPanel
      .querySelectorAll('a')
      .forEach((link) => {

        link.addEventListener('click', () => {

          menuToggle.setAttribute(
            'aria-expanded',
            'false'
          );


          menuPanel.classList.remove(
            'is-open'
          );

        });

      });

  }



  /*
   * =======================================================
   * 신청 폼
   * =======================================================
   */

  initApplicationForm();



  /*
   * =======================================================
   * REAL REVIEW
   * =======================================================
   */

  loadRealReviews();

});



/*
 * =========================================================
 * 신청 폼
 * =========================================================
 */

function initApplicationForm() {

  const form =
    document.querySelector('#application-form');


  /*
   * 신청 폼이 없으면 여기서만 종료
   *
   * 중요:
   * main.js 전체를 종료하면 안 됩니다.
   */

  if (!form) {
    return;
  }



  /*
   * 희망 상담 날짜
   */

  const dateInput =
    form.querySelector(
      '[name="preferred_date"]'
    );


  if (dateInput) {

    dateInput.min =
      new Date()
        .toISOString()
        .split('T')[0];

  }



  /*
   * 전화번호
   */

  const phoneInput =
    form.querySelector(
      '[name="phone"]'
    );


  if (phoneInput) {

    phoneInput.addEventListener(
      'input',
      () => {

        const digits =
          phoneInput.value
            .replace(/\D/g, '')
            .slice(0, 11);


        phoneInput.value =
          digits.length > 7

            ? `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`

            : digits.length > 3

              ? `${digits.slice(0, 3)}-${digits.slice(3)}`

              : digits;

      }
    );

  }



  /*
   * 신청 폼 제출
   */

  form.addEventListener(
    'submit',
    (event) => {

      event.preventDefault();


      const status =
        form.querySelector(
          '.form-status'
        );


      if (!form.checkValidity()) {

        form.reportValidity();

        return;

      }


      if (status) {

        status.textContent =
          '신청 내용을 확인했습니다. 곧 연락드리겠습니다.';

      }

    }
  );

}



/*
 * =========================================================
 * REAL REVIEW
 * =========================================================
 */

async function loadRealReviews() {

  console.log(
    '[MOV] REAL REVIEW 로딩 시작'
  );


  /*
   * 리뷰 영역 찾기
   */

  const reviewBox =
    document.querySelector('#real-review');


  if (!reviewBox) {

    console.error(
      '[MOV] #real-review 영역을 찾을 수 없습니다.'
    );

    return;

  }



  /*
   * 리뷰 텍스트
   */

  const reviewText =
    reviewBox.querySelector(
      '.real-review__text'
    );


  /*
   * 리뷰 이름
   */

  const reviewName =
    reviewBox.querySelector(
      '.real-review__name'
    );


  if (!reviewText || !reviewName) {

    console.error(
      '[MOV] 리뷰 텍스트 영역을 찾을 수 없습니다.'
    );

    return;

  }



  try {

    console.log(
      '[MOV] Google Sheets API 호출:',
      REVIEW_API_URL
    );


    /*
     * Apps Script API 호출
     */

    const response =
      await fetch(
        REVIEW_API_URL + '?t=' + Date.now(),
        {
          method: 'GET',
          cache: 'no-store'
        }
      );


    console.log(
      '[MOV] API 응답 상태:',
      response.status
    );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }



    /*
     * JSON 읽기
     */

    const data =
      await response.json();


    console.log(
      '[MOV] Google Sheets 리뷰 데이터:',
      data
    );



    /*
     * Apps Script 오류
     */

    if (!data.success) {

      throw new Error(
        data.error ||
        'Google Sheets API에서 오류가 발생했습니다.'
      );

    }



    /*
     * 공개 리뷰 없음
     */

    if (
      !Array.isArray(data.reviews) ||
      data.reviews.length === 0
    ) {

      reviewText.textContent =
        '아직 공개된 리뷰가 없습니다.';


      reviewName.textContent =
        'CLIENT';


      return;

    }



    /*
     * =====================================================
     * 리뷰 표시 함수
     * =====================================================
     */

    function showReview(review) {

      reviewText.textContent =
        `“${review.text}”`;


      reviewName.textContent =
        review.name || 'CLIENT';

    }



    /*
     * 첫 번째 리뷰
     */

    let currentIndex = 0;


    showReview(
      data.reviews[currentIndex]
    );



    /*
     * 리뷰가 여러 개일 경우
     * 5초마다 변경
     */

    if (data.reviews.length > 1) {

      setInterval(() => {

        currentIndex =
          (currentIndex + 1) %
          data.reviews.length;


        showReview(
          data.reviews[currentIndex]
        );

      }, 5000);

    }

  } catch (error) {

    console.error(
      '[MOV] REAL REVIEW 로딩 실패:',
      error
    );


    reviewText.textContent =
      '리뷰를 불러오지 못했습니다.';


    reviewName.textContent =
      'CLIENT';

  }

}