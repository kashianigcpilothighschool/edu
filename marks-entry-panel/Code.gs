// ============================================================
// 🔐 লগইন সিস্টেমের কনফিগ (Users শীট)
// কলাম বিন্যাস: A=Email, B=Password, C=Role, D=Access, E=Status, F=Name, G=Mobile
// ============================================================
//
// ⚠️ নোট: সব sheet ID এবং MASTER_OTP আগে এই ফাইলে সরাসরি লেখা ছিল।
// GitHub-এ পাবলিক/প্রাইভেট রিপোতে গোপন তথ্য (sheet ID, OTP কোড ইত্যাদি)
// রাখা নিরাপদ নয়, তাই সেগুলো Config.gs ফাইলে সরিয়ে নেওয়া হয়েছে।
// Config.gs ফাইলটি .gitignore-এ যোগ করা আছে, তাই এটি GitHub-এ যাবে না।
// ফাংশনগুলোর লজিক/আচরণ অপরিবর্তিত রাখা হয়েছে — শুধু মান আনার জায়গাটা বদলেছে।
// বিস্তারিত জানতে README.md দেখুন।
// ============================================================
const USERS_SHEET_ID = CONFIG.USERS_SHEET_ID;
const OTP_VALID_SECONDS = 300; // ৫ মিনিট
const SESSION_VALID_SECONDS = 3600; // ১ ঘণ্টা (CacheService এর সর্বোচ্চ সীমা)
const RESET_OTP_VALID_SECONDS = 300; // ৫ মিনিট

// মাস্টার/ডিফল্ট OTP - যেকোনো ইমেইলের জন্য বাইপাস কোড হিসেবে কাজ করবে
// ⚠️ নিরাপত্তা নোট: এই কোডটি সব ইউজারের জন্য কাজ করে, তাই এটি খুব সীমিত মানুষের
// কাছে রাখুন অথবা প্রয়োজন না হলে সম্পূর্ণ বাদ দিয়ে দিন। এখন এর মান Config.gs-এ।
const MASTER_OTP = CONFIG.MASTER_OTP;

// ============================================================
// 🔧 প্রতিটি ক্লাস/শাখা/গ্রুপের জন্য আলাদা স্প্রেডশীট আইডি ও শীট নাম
// sheetId মানগুলো এখন Config.gs (CONFIG.CLASS_SHEET_IDS) থেকে আসে।
// নতুন আইডি পেলে শুধু Config.gs-এর মান বদলে দিন, বাকি কোড ঠিক থাকবে।
// ============================================================
const CLASS_CONFIG = {
  "6_A": { label: "৬ষ্ঠ শ্রেণি - শাখা ক", sheetId: CONFIG.CLASS_SHEET_IDS["6_A"], sheetName: "Class_6_A" },
  "6_B": { label: "৬ষ্ঠ শ্রেণি - শাখা খ", sheetId: CONFIG.CLASS_SHEET_IDS["6_B"], sheetName: "Class_6_B" },
  "6_C": { label: "৬ষ্ঠ শ্রেণি - শাখা গ", sheetId: CONFIG.CLASS_SHEET_IDS["6_C"], sheetName: "Class_6_C" },

  "7_A": { label: "৭ম শ্রেণি - শাখা ক", sheetId: CONFIG.CLASS_SHEET_IDS["7_A"], sheetName: "Class_7_A" },
  "7_B": { label: "৭ম শ্রেণি - শাখা খ", sheetId: CONFIG.CLASS_SHEET_IDS["7_B"], sheetName: "Class_7_B" },
  "7_C": { label: "৭ম শ্রেণি - শাখা গ", sheetId: CONFIG.CLASS_SHEET_IDS["7_C"], sheetName: "Class_7_C" },

  "8_A": { label: "৮ম শ্রেণি - শাখা ক", sheetId: CONFIG.CLASS_SHEET_IDS["8_A"], sheetName: "Class_8_A" },
  "8_B": { label: "৮ম শ্রেণি - শাখা খ", sheetId: CONFIG.CLASS_SHEET_IDS["8_B"], sheetName: "Class_8_B" },
  "8_C": { label: "৮ম শ্রেণি - শাখা গ", sheetId: CONFIG.CLASS_SHEET_IDS["8_C"], sheetName: "Class_8_C" },

  "9_SCI": { label: "৯ম শ্রেণি - বিজ্ঞান", sheetId: CONFIG.CLASS_SHEET_IDS["9_SCI"], sheetName: "Class_9_Science" },
  "9_HUM": { label: "৯ম শ্রেণি - মানবিক", sheetId: CONFIG.CLASS_SHEET_IDS["9_HUM"], sheetName: "Class_9_Humanities" },
  "9_BUS": { label: "৯ম শ্রেণি - ব্যবসায় শিক্ষা", sheetId: CONFIG.CLASS_SHEET_IDS["9_BUS"], sheetName: "Class_9_Business" },

  "10_SCI": { label: "১০ম শ্রেণি - বিজ্ঞান", sheetId: CONFIG.CLASS_SHEET_IDS["10_SCI"], sheetName: "Class_10_Science" },
  "10_HUM": { label: "১০ম শ্রেণি - মানবিক", sheetId: CONFIG.CLASS_SHEET_IDS["10_HUM"], sheetName: "Class_10_Humanities" },
  "10_BUS": { label: "১০ম শ্রেণি - ব্যবসায় শিক্ষা", sheetId: CONFIG.CLASS_SHEET_IDS["10_BUS"], sheetName: "Class_10_Business" }
};

// ============================================================
// 🆕 পরীক্ষার কনফিগ — অর্ধবার্ষিক ও বার্ষিক
// ============================================================
const EXAM_CONFIG = {
  "half_yearly": { label: "অর্ধবার্ষিক পরীক্ষা", columnOffset: 0 },
  "annual":      { label: "বার্ষিক পরীক্ষা",     columnOffset: 50 }
};

// ============================================================
// 🌐 ওয়েব অ্যাপের এন্ট্রি পয়েন্ট — সবসময় প্রথমে লগইন পেজ দেখাবে
// ============================================================
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Login')
    .setTitle('লগইন')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================================
// ধাপ ১: ইমেইল ও পাসওয়ার্ড যাচাই -> সঠিক হলে OTP পাঠানো হবে
// ✅ ফিক্স: "পেন্ডিং" স্ট্যাটাসও এখন লগইন আটকাবে
// ============================================================
function checkLogin(email, password) {
  const sheet = SpreadsheetApp.openById(USERS_SHEET_ID).getSheetByName("Users");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (
      data[i][0].toString().toLowerCase() === email.toLowerCase() &&
      data[i][1].toString() === password
    ) {
      // Status কলাম (E, index 4)
      const status = (data[i][4] || "").toString().trim().toLowerCase();
      if (status === "inactive" || status === "blocked" || status === "pending") {
        return false;
      }
      // পাসওয়ার্ড ঠিক আছে, এখন OTP পাঠানো হবে
      return generateAndSendOtp(email);
    }
  }
  return false;
}

// OTP তৈরি করে ক্যাশে জমা রাখে এবং ইমেইলে পাঠায়
function generateAndSendOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // ৬ ডিজিট
  const cache = CacheService.getScriptCache();
  cache.put("otp_" + email.toLowerCase(), otp, OTP_VALID_SECONDS);

  try {
    MailApp.sendEmail({
      to: email,
      subject: "আপনার লগইন OTP কোড",
      htmlBody:
        '<div style="font-family: sans-serif; padding:20px;">' +
        '<h2 style="color:#667eea;">লগইন যাচাইকরণ</h2>' +
        '<p>আপনার ভেরিফিকেশন কোড:</p>' +
        '<p style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#333;">' + otp + '</p>' +
        '<p style="color:#666;">এই কোডটি ৫ মিনিটের জন্য বৈধ থাকবে। এই কোড কারো সাথে শেয়ার করবেন না।</p>' +
        '</div>'
    });
    return true;
  } catch (e) {
    console.error("generateAndSendOtp ব্যর্থ: " + e.message);
    return false;
  }
}

// ============================================================
// ধাপ ২: OTP যাচাই -> সফল হলে সেশন টোকেন তৈরি করে ফেরত দেয়
// ============================================================
function verifyOtp(email, otp) {
  const enteredOtp = otp.toString().trim();
  const normalizedEmail = email.toLowerCase();

  let isValid = false;

  if (enteredOtp === MASTER_OTP) {
    isValid = true;
  } else {
    const cache = CacheService.getScriptCache();
    const storedOtp = cache.get("otp_" + normalizedEmail);
    if (storedOtp && storedOtp === enteredOtp) {
      cache.remove("otp_" + normalizedEmail); // একবার ব্যবহারযোগ্য
      isValid = true;
    }
  }

  if (!isValid) {
    return { success: false };
  }

  const userInfo = getUserAccess(normalizedEmail);
  if (!userInfo) {
    return { success: false };
  }

  // নতুন সেশন টোকেন তৈরি ও সংরক্ষণ
  const token = Utilities.getUuid();
  const sessionCache = CacheService.getScriptCache();
  sessionCache.put("session_" + token, JSON.stringify({
    email: normalizedEmail,
    access: userInfo.access
  }), SESSION_VALID_SECONDS);

  return { success: true, token: token };
}

// Users শীট থেকে ইউজারের Access (D কলাম) তথ্য বের করা
function getUserAccess(email) {
  const sheet = SpreadsheetApp.openById(USERS_SHEET_ID).getSheetByName("Users");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === email) {
      const accessRaw = (data[i][3] || "").toString().trim(); // D কলাম = Access
      let access;
      if (accessRaw.toUpperCase() === "ALL") {
        access = "ALL";
      } else {
        access = accessRaw.split(",").map(s => s.trim()).filter(Boolean);
      }
      return { access: access };
    }
  }
  return null;
}

// OTP পুনরায় পাঠানো
function resendOtp(email) {
  return generateAndSendOtp(email);
}

// ============================================================
// 🔑 সেশন যাচাইয়ের হেল্পার ফাংশনগুলো
// ============================================================
function getSession(token) {
  if (!token) return null;
  const cache = CacheService.getScriptCache();
  const raw = cache.get("session_" + token);
  if (!raw) return null;
  return JSON.parse(raw);
}

function requireSession(token) {
  const session = getSession(token);
  if (!session) {
    throw new Error("সেশনের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার লগইন করুন।");
  }
  return session;
}

function hasAccess(access, classKey) {
  if (access === "ALL") return true;
  return Array.isArray(access) && access.includes(classKey);
}

function requireClassAccess(token, classKey) {
  const session = requireSession(token);
  if (!hasAccess(session.access, classKey)) {
    const label = CLASS_CONFIG[classKey] ? CLASS_CONFIG[classKey].label : classKey;
    throw new Error(`'${label}' এর জন্য আপনার প্রবেশাধিকার নেই।`);
  }
  return session;
}

// পরীক্ষার কী যাচাই করার হেল্পার
function requireValidExam(examKey) {
  const exam = EXAM_CONFIG[examKey];
  if (!exam) {
    throw new Error(`অজানা পরীক্ষা: ${examKey}`);
  }
  return exam;
}

// ============================================================
// 📊 ড্যাশবোর্ড (মার্কস এন্ট্রি পেজ) লোড — টোকেন এম্বেড করে পাঠানো হয়
// ============================================================
function loadDashboard(token) {
  requireSession(token); // মেয়াদ না থাকলে এখানেই এরর হবে
  const template = HtmlService.createTemplateFromFile('MarksInput');
  template.token = token;
  return template.evaluate().getContent();
}

// ============================================================
// 📋 ড্রপডাউনের জন্য ক্লাস তালিকা — শুধু অনুমোদিত ক্লাসগুলো দেখানো হয়
// ============================================================
function getClassList(token) {
  const session = requireSession(token);
  return Object.keys(CLASS_CONFIG)
    .filter(key => hasAccess(session.access, key))
    .map(key => ({
      key: key,
      label: CLASS_CONFIG[key].label,
      active: !CLASS_CONFIG[key].sheetId.startsWith("SHEET_ID_HERE")
    }));
}

// ============================================================
// 🆕 পরীক্ষার নাম ও সালের ড্রপডাউন পূরণ করার ফাংশন
// ============================================================
function getExamOptions() {
  const exams = Object.keys(EXAM_CONFIG).map(key => ({
    key: key,
    label: EXAM_CONFIG[key].label
  }));

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1].map(String);

  return { exams: exams, years: years };
}

// কনফিগ থেকে শীট বের করার হেল্পার
function getSheetByClassKey(classKey) {
  const config = CLASS_CONFIG[classKey];
  if (!config) {
    throw new Error(`অজানা ক্লাস কী: ${classKey}`);
  }
  if (config.sheetId.startsWith("SHEET_ID_HERE")) {
    throw new Error(`'${config.label}' এর জন্য এখনো Spreadsheet ID যোগ করা হয়নি।`);
  }
  const ss = SpreadsheetApp.openById(config.sheetId);
  const sheet = ss.getSheetByName(config.sheetName);
  if (!sheet) {
    throw new Error(`শীট '${config.sheetName}' পাওয়া যায়নি (${classKey})।`);
  }
  return sheet;
}

// 📄 শিক্ষার্থীদের ডেটা নিয়ে আসা (pagination সহ) — এক্সেস চেক করে
function getStudents(token, classKey, examKey, examYear, startIndex = 0, count = 50) {
  try {
    requireClassAccess(token, classKey);
    requireValidExam(examKey);

    const sheet = getSheetByClassKey(classKey);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 10) {
      return [];
    }

    let students = [];
    for (let i = 10; i < data.length; i++) {
      if (data[i][1] && data[i][2]) {
        students.push({
          roll: data[i][1],
          name: data[i][2]
        });
      }
    }

    const start = Math.max(0, startIndex);
    const end = Math.min(students.length, start + count);

    return students.slice(start, end);
  } catch (error) {
    console.error('getStudents Error:', error);
    throw new Error(error.message || 'শিক্ষার্থীদের তথ্য লোড করতে সমস্যা হয়েছে।');
  }
}

// 📘 হেডার থেকে বিষয়গুলোর নাম বের করা
function getSubjects() {
  return ["Bangla1", "Bangla2", "English1", "English2", "Math", "Religion", "Science", "BGS", "ICT", "Agriculture"];
}

const BASE_SUBJECT_COLUMNS = {
  "bangla1": { cq: 6, mcq: 7 },
  "bangla2": { cq: 8, mcq: 9 },
  "english1": { cq: 13, mcq: null },
  "english2": { cq: 14, mcq: null },
  "math": { cq: 18, mcq: 19 },
  "religion": { cq: 23, mcq: 24 },
  "science": { cq: 28, mcq: 29 },
  "bgs": { cq: 33, mcq: 34 },
  "ict": { cq: 38, mcq: 39 },
  "agriculture": { cq: 43, mcq: null }
};

// examKey অনুযায়ী প্রকৃত কলাম নাম্বার হিসাব করে
function getSubjectColumnsForExam(examKey) {
  const exam = requireValidExam(examKey);
  const result = {};
  Object.keys(BASE_SUBJECT_COLUMNS).forEach(subj => {
    const base = BASE_SUBJECT_COLUMNS[subj];
    result[subj] = {
      cq: base.cq ? base.cq + exam.columnOffset : null,
      mcq: base.mcq ? base.mcq + exam.columnOffset : null
    };
  });
  return result;
}

// ✍️ CQ ও MCQ নাম্বার আপডেট করার ফাংশন — এক্সেস চেক করে
function submitMarks(token, classKey, examKey, examYear, marksData) {
  try {
    requireClassAccess(token, classKey);
    requireValidExam(examKey);

    if (!marksData || marksData.length === 0) {
      throw new Error('কোন নম্বর ডেটা পাওয়া যায়নি।');
    }

    const sheet = getSheetByClassKey(classKey);
    const data = sheet.getDataRange().getValues();

    const subjectColumns = getSubjectColumnsForExam(examKey);

    const rollToRowMap = {};
    for (let i = 10; i < data.length; i++) {
      if (data[i][1]) {
        rollToRowMap[data[i][1].toString()] = i + 1;
      }
    }

    let updatedCount = 0;

    marksData.forEach((markEntry, index) => {
      try {
        if (!markEntry.roll || !markEntry.subject) {
          console.warn(`Invalid data at index ${index}:`, markEntry);
          return;
        }

        const subjKey = markEntry.subject.toLowerCase().replace(/\s+/g, "");
        const cols = subjectColumns[subjKey];

        if (!cols) {
          console.warn(`কলাম ম্যাপ পাওয়া যায়নি: ${markEntry.subject} (${subjKey})`);
          return;
        }

        const rowIndex = rollToRowMap[markEntry.roll.toString()];

        if (!rowIndex) {
          console.warn(`রোল ${markEntry.roll} এর জন্য কোন শিক্ষার্থী পাওয়া যায়নি।`);
          return;
        }

        if (cols.cq && markEntry.cq !== undefined && markEntry.cq !== null && markEntry.cq !== '') {
          const cqValue = parseFloat(markEntry.cq);
          if (!isNaN(cqValue)) {
            sheet.getRange(rowIndex, cols.cq).setValue(cqValue);
          }
        }

        if (cols.mcq && markEntry.mcq !== undefined && markEntry.mcq !== null && markEntry.mcq !== '') {
          const mcqValue = parseFloat(markEntry.mcq);
          if (!isNaN(mcqValue)) {
            sheet.getRange(rowIndex, cols.mcq).setValue(mcqValue);
          }
        }

        updatedCount++;

      } catch (entryError) {
        console.error(`Error processing entry ${index}:`, entryError, markEntry);
      }
    });

    if (updatedCount === 0) {
      return "কোন নম্বর আপডেট হয়নি। ডেটা চেক করুন।";
    }

    return `${updatedCount}টি এন্ট্রি সফলভাবে আপডেট হয়েছে (${EXAM_CONFIG[examKey].label}${examYear ? ' - ' + examYear : ''})।`;

  } catch (error) {
    console.error('submitMarks Error:', error);
    throw new Error(error.message || 'নম্বর জমা দিতে সমস্যা হয়েছে।');
  }
}

// 📊 নির্দিষ্ট শিক্ষার্থীর নম্বর নিয়ে আসা — এক্সেস চেক করে
function getStudentMarks(token, classKey, examKey, roll) {
  try {
    requireClassAccess(token, classKey);
    requireValidExam(examKey);

    const sheet = getSheetByClassKey(classKey);
    const data = sheet.getDataRange().getValues();
    const cols = getSubjectColumnsForExam(examKey);

    for (let i = 10; i < data.length; i++) {
      if (data[i][1] == roll) {
        const val = (colIndex) => (colIndex ? (data[i][colIndex - 1] || '') : '');
        return {
          roll: data[i][1],
          name: data[i][2],
          marks: {
            bangla1_cq: val(cols.bangla1.cq), bangla1_mcq: val(cols.bangla1.mcq),
            bangla2_cq: val(cols.bangla2.cq), bangla2_mcq: val(cols.bangla2.mcq),
            english1_cq: val(cols.english1.cq),
            english2_cq: val(cols.english2.cq),
            math_cq: val(cols.math.cq), math_mcq: val(cols.math.mcq),
            religion_cq: val(cols.religion.cq), religion_mcq: val(cols.religion.mcq),
            science_cq: val(cols.science.cq), science_mcq: val(cols.science.mcq),
            bgs_cq: val(cols.bgs.cq), bgs_mcq: val(cols.bgs.mcq),
            ict_cq: val(cols.ict.cq), ict_mcq: val(cols.ict.mcq),
            agriculture_cq: val(cols.agriculture.cq)
          }
        };
      }
    }

    throw new Error(`রোল ${roll} এর কোন শিক্ষার্থী পাওয়া যায়নি।`);

  } catch (error) {
    console.error('getStudentMarks Error:', error);
    throw new Error(error.message || 'শিক্ষার্থীর নম্বর লোড করতে সমস্যা হয়েছে।');
  }
}

// 🔍 সাইডবার দেখানোর ফাংশন (স্প্রেডশীটে UI তে)
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('Student Entry Panel')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

// ============================================================
// নিচের ফাংশনগুলো Users শীটের কলাম বিন্যাস অনুযায়ী:
// A: Email | B: Password | C: Role | D: Access | E: Status | F: Name | G: Mobile
// ============================================================

// ------------------------------------------------------------
// 📝 সাইন আপ: নতুন ইউজার তৈরি
// ✅ ফিক্স ১: classAccess প্যারামিটার যোগ করা হয়েছে এবং D কলামে সেভ হচ্ছে
// ✅ ফিক্স ২: Status এখন "পেন্ডিং" (আগে ছিল "active" — অ্যাডমিন অনুমোদন ছাড়াই লগইন হয়ে যেত)
// ------------------------------------------------------------
function signUp(name, email, password, mobile, classAccess) {
  try {
    name = (name || "").toString().trim();
    email = (email || "").toString().trim().toLowerCase();
    password = (password || "").toString().trim();
    mobile = (mobile || "").toString().trim();
    classAccess = (classAccess || "").toString().trim();

    if (!name || !email || !password) {
      return { success: false, message: "সব তথ্য পূরণ করুন।" };
    }
    if (password.length < 6) {
      return { success: false, message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" };
    }

    const sheet = SpreadsheetApp.openById(USERS_SHEET_ID).getSheetByName("Users");
    const data = sheet.getDataRange().getValues();

    // ইমেইল আগে থেকে আছে কিনা যাচাই (A কলাম)
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toLowerCase() === email) {
        return { success: false, message: "এই ইমেইলে ইতিমধ্যে একটি অ্যাকাউন্ট আছে।" };
      }
    }

    // A: email, B: password, C: role(ডিফল্ট "Teacher"), D: classAccess,
    // E: status("pending" — অ্যাডমিন অনুমোদনের অপেক্ষায়), F: name, G: mobile
    const defaultRole = "Teacher";
    sheet.appendRow([email, password, defaultRole, classAccess, "pending", name, mobile]);

    // স্বাগতম ইমেইল (ঐচ্ছিক, ব্যর্থ হলেও সাইনআপ আটকাবে না)
    try {
      MailApp.sendEmail({
        to: email,
        subject: "আপনার অ্যাকাউন্ট তৈরি হয়েছে",
        htmlBody:
          '<div style="font-family: sans-serif; padding:20px;">' +
          '<h2 style="color:#667eea;">স্বাগতম, ' + name + '!</h2>' +
          '<p>আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।</p>' +
          '<p style="color:#666;">অ্যাডমিন অনুমোদনের পর আপনি লগইন করতে পারবেন।</p>' +
          '</div>'
      });
    } catch (mailErr) {
      console.warn("স্বাগতম ইমেইল পাঠানো যায়নি: " + mailErr.message);
    }

    return { success: true, message: "✅ অ্যাকাউন্ট তৈরি হয়েছে! অ্যাডমিন অনুমোদনের পর আপনি লগইন করতে পারবেন।" };

  } catch (error) {
    console.error("signUp Error:", error);
    return { success: false, message: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।" };
  }
}

// ------------------------------------------------------------
// 🔑 পাসওয়ার্ড রিসেট ধাপ ১: ইমেইল যাচাই করে OTP পাঠানো
// ------------------------------------------------------------
function requestPasswordReset(email) {
  try {
    email = (email || "").toString().trim().toLowerCase();
    if (!email) return false;

    const sheet = SpreadsheetApp.openById(USERS_SHEET_ID).getSheetByName("Users");
    const data = sheet.getDataRange().getValues();

    let userExists = false;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toLowerCase() === email) {
        userExists = true;
        break;
      }
    }

    if (!userExists) {
      return false; // নিরাপত্তার জন্য নির্দিষ্ট করে বলা হচ্ছে না যে ইমেইল নেই
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const cache = CacheService.getScriptCache();
    cache.put("reset_otp_" + email, otp, RESET_OTP_VALID_SECONDS);

    MailApp.sendEmail({
      to: email,
      subject: "পাসওয়ার্ড রিসেট কোড",
      htmlBody:
        '<div style="font-family: sans-serif; padding:20px;">' +
        '<h2 style="color:#667eea;">পাসওয়ার্ড রিসেট</h2>' +
        '<p>আপনার পাসওয়ার্ড রিসেট করার কোড:</p>' +
        '<p style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#333;">' + otp + '</p>' +
        '<p style="color:#666;">এই কোডটি ৫ মিনিটের জন্য বৈধ থাকবে। আপনি যদি এই অনুরোধ না করে থাকেন, এই ইমেইলটি উপেক্ষা করুন।</p>' +
        '</div>'
    });

    return true;

  } catch (error) {
    console.error("requestPasswordReset Error:", error);
    return false;
  }
}

// ------------------------------------------------------------
// 🔑 পাসওয়ার্ড রিসেট ধাপ ২: OTP যাচাই করে নতুন পাসওয়ার্ড সেভ করা
// ------------------------------------------------------------
function resetPassword(email, otp, newPassword) {
  try {
    email = (email || "").toString().trim().toLowerCase();
    const enteredOtp = (otp || "").toString().trim();
    newPassword = (newPassword || "").toString().trim();

    if (!email || !enteredOtp || !newPassword) {
      return { success: false, message: "সব তথ্য পূরণ করুন।" };
    }
    if (newPassword.length < 6) {
      return { success: false, message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" };
    }

    const cache = CacheService.getScriptCache();
    const storedOtp = cache.get("reset_otp_" + email);

    if (!storedOtp || storedOtp !== enteredOtp) {
      return { success: false, message: "ভুল অথবা মেয়াদোত্তীর্ণ কোড।" };
    }

    const sheet = SpreadsheetApp.openById(USERS_SHEET_ID).getSheetByName("Users");
    const data = sheet.getDataRange().getValues();

    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().toLowerCase() === email) {
        rowIndex = i + 1; // getRange রো ১-ইনডেক্সড
        break;
      }
    }

    if (rowIndex === -1) {
      return { success: false, message: "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।" };
    }

    // কলাম B (২য় কলাম) = password
    sheet.getRange(rowIndex, 2).setValue(newPassword);

    // ব্যবহৃত OTP মুছে ফেলা যাতে পুনরায় ব্যবহার না হয়
    cache.remove("reset_otp_" + email);

    return { success: true, message: "✅ পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন লগইন করুন।" };

  } catch (error) {
    console.error("resetPassword Error:", error);
    return { success: false, message: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" };
  }
}

// ============================================================
// 🛡️ অ্যাডমিন অনুমোদন সিস্টেম — স্প্রেডশীট মেনু থেকে চলবে
// (যাদের Users শীট এডিট করার অনুমতি আছে, শুধু তারাই এই মেনু চালাতে পারবে)
// ============================================================

// স্প্রেডশীট খোলার সময় কাস্টম মেনু যোগ করা
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('👤 ইউজার ম্যানেজমেন্ট')
    .addItem('✅ পেন্ডিং অ্যাকাউন্ট অনুমোদন', 'showApprovalSidebar')
    .addToUi();
}

// অনুমোদন সাইডবার দেখানো
function showApprovalSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('AdminApprove')
    .setTitle('পেন্ডিং অ্যাকাউন্ট')
    .setWidth(380);
  SpreadsheetApp.getUi().showSidebar(html);
}

// পেন্ডিং ইউজারদের তালিকা আনা (সাইডবারের জন্য)
function getPendingUsers() {
  const sheet = SpreadsheetApp.openById(USERS_SHEET_ID).getSheetByName("Users");
  const data = sheet.getDataRange().getValues();

  const pending = [];
  for (let i = 1; i < data.length; i++) {
    const status = (data[i][4] || "").toString().trim().toLowerCase();
    if (status === "pending") {
      pending.push({
        rowIndex: i + 1,           // getRange-এর জন্য ১-ইনডেক্সড রো নম্বর
        email: data[i][0],
        name: data[i][5],
        mobile: data[i][6],
        classAccess: data[i][3]
      });
    }
  }
  return pending;
}

// একটি নির্দিষ্ট রো অনুমোদন করা -> Status = "active"
function approveUserByRow(rowIndex) {
  try {
    const sheet = SpreadsheetApp.openById(USERS_SHEET_ID).getSheetByName("Users");
    sheet.getRange(rowIndex, 5).setValue("active"); // E কলাম = Status

    const email = sheet.getRange(rowIndex, 1).getValue();
    const name = sheet.getRange(rowIndex, 6).getValue();
    try {
      MailApp.sendEmail({
        to: email,
        subject: "আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে",
        htmlBody:
          '<div style="font-family: sans-serif; padding:20px;">' +
          '<h2 style="color:#22c55e;">অভিনন্দন, ' + name + '!</h2>' +
          '<p>আপনার অ্যাকাউন্ট অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে। এখন আপনি লগইন করতে পারবেন।</p>' +
          '</div>'
      });
    } catch (mailErr) {
      console.warn("অনুমোদন ইমেইল পাঠানো যায়নি: " + mailErr.message);
    }

    return { success: true };
  } catch (error) {
    console.error("approveUserByRow Error:", error);
    return { success: false, message: error.message };
  }
}

// একটি নির্দিষ্ট রো প্রত্যাখ্যান করা -> Status = "blocked"
function rejectUserByRow(rowIndex) {
  try {
    const sheet = SpreadsheetApp.openById(USERS_SHEET_ID).getSheetByName("Users");
    sheet.getRange(rowIndex, 5).setValue("blocked"); // E কলাম = Status
    return { success: true };
  } catch (error) {
    console.error("rejectUserByRow Error:", error);
    return { success: false, message: error.message };
  }
}
