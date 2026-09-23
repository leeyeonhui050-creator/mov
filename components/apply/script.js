const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwOu6SBgYnY7QyhRVcMcE96hAN7F_IdIWcFx7NASAhXexdZIJh9Ev79lrtwRcac3gZBJQ/exec";


const form = document.getElementById("applicationForm");
const phoneInput = document.getElementById("phone");
const message = document.getElementById("formMessage");


function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}


function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `form-message ${type ? `is-${type}` : ""}`;
}


phoneInput.addEventListener("input", () => {
  phoneInput.value = formatPhone(phoneInput.value);
});


form.addEventListener("submit", async (event) => {
  event.preventDefault();

  showMessage("");

  const phoneDigits = phoneInput.value.replace(/\D/g, "");

  if (!/^010\d{8}$/.test(phoneDigits)) {
    showMessage(
      "연락처는 010으로 시작하는 휴대전화 번호 11자리로 입력해주세요.",
      "error"
    );

    phoneInput.focus();
    return;
  }


  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }


  const submitButton = form.querySelector(".submit-button");

  submitButton.disabled = true;
  submitButton.textContent = "SUBMITTING...";


  const payload = {
    name: document.getElementById("name").value.trim(),
    gender: document.getElementById("gender").value,
    age: document.getElementById("age").value,
    address: document.getElementById("address").value.trim(),
    job: document.getElementById("job").value.trim(),
    desired: document.getElementById("desired").value.trim(),
    reason: document.getElementById("reason").value.trim(),
    available: document.getElementById("available").value.trim(),
    callTime: document.getElementById("callTime").value.trim(),
    phone: phoneDigits,
    instagram: document.getElementById("instagram").value.trim()
  };


  try {
    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });


    form.reset();

    showMessage(
      "신청이 접수되었습니다. 확인 후 연락드리겠습니다.",
      "success"
    );

    setTimeout(() => {
  window.location.href = "../../index.html";
}, 2000);

  } catch (error) {

    console.error(error);

    showMessage(
      "전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      "error"
    );

  } finally {

    submitButton.disabled = false;
    submitButton.textContent = "APPLICATION SUBMIT ↗";
  }
});