const SPREADSHEET_NAME = 'MOV 스타일 체험 신청서';
const SHEET_NAME = 'applications';

const HEADERS = [
  '이름',
  '성별',
  '나이',
  '주소',
  '직업',
  '이 체험을 통해 얻고 싶은 것',
  '신청하게 된 계기',
  '참여 가능한 요일과 시간',
  '통화 가능한 시간(5-10분)',
  '체험 안내 받을 연락처',
  '인스타그램',
  '신청일시'
];

function doGet() {
  return jsonOutput({
    success: true,
    message: 'MOV application endpoint is running.'
  });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('POST 데이터가 없습니다.');
    }

    const data = JSON.parse(e.postData.contents);

    const phone = String(data.phone || '').replace(/\D/g, '');
    if (!/^010\d{8}$/.test(phone)) {
      throw new Error('연락처는 010으로 시작하는 11자리 번호여야 합니다.');
    }

    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = getOrCreateSheet(spreadsheet);

    sheet.appendRow([
      String(data.name || ''),
      String(data.gender || ''),
      String(data.age || ''),
      String(data.address || ''),
      String(data.job || ''),
      String(data.desired || ''),
      String(data.reason || ''),
      String(data.available || ''),
      String(data.callTime || ''),
      phone,
      String(data.instagram || ''),
      new Date()
    ]);

    return jsonOutput({
      success: true,
      message: '신청이 정상적으로 접수되었습니다.'
    });
  } catch (error) {
    return jsonOutput({
      success: false,
      message: error.message || String(error)
    });
  }
}

function getOrCreateSpreadsheet() {
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty('MOV_SPREADSHEET_ID');

  if (savedId) {
    try {
      return SpreadsheetApp.openById(savedId);
    } catch (error) {
      properties.deleteProperty('MOV_SPREADSHEET_ID');
    }
  }

  const spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
  properties.setProperty('MOV_SPREADSHEET_ID', spreadsheet.getId());

  return spreadsheet;
}

function getOrCreateSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }

  return sheet;
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
