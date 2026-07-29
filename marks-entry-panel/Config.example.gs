// ============================================================
// 📄 Config.example.gs
// ============================================================
// এটি একটি টেমপ্লেট ফাইল — এখানে কোনো আসল/গোপন তথ্য নেই।
//
// ব্যবহারের নিয়ম:
// 1) এই ফাইলটি কপি করে "Config.gs" নামে সেভ করুন
//    (Apps Script এডিটরে বা clasp দিয়ে লোকাল ফোল্ডারে)
// 2) নিচের সব "..." জায়গায় আপনার প্রকৃত Spreadsheet ID ও কোড বসান
// 3) Config.gs ফাইলটি .gitignore-এ যোগ করা আছে, তাই এটি GitHub-এ
//    আপলোড হবে না — আপনার গোপন তথ্য নিরাপদ থাকবে।
//
// Sheet ID কীভাবে বের করবেন:
// আপনার Google Sheet-এর URL থেকে —
// https://docs.google.com/spreadsheets/d/  <THIS_PART_IS_THE_ID>  /edit
// ============================================================

const CONFIG = {
  // Users শীট থাকা স্প্রেডশীটের ID
  USERS_SHEET_ID: "PASTE_YOUR_USERS_SHEET_ID_HERE",

  // ⚠️ মাস্টার/বাইপাস OTP — সব ইউজারের জন্য কাজ করে।
  // নিরাপত্তার জন্য এটি এলোমেলো ও গোপন একটি কোড রাখুন,
  // অথবা প্রয়োজন না হলে Code.gs থেকে এই ফিচারটি সম্পূর্ণ সরিয়ে দিন।
  MASTER_OTP: "PASTE_YOUR_MASTER_OTP_HERE",

  // প্রতিটি ক্লাস/শাখা/গ্রুপের জন্য আলাদা স্প্রেডশীট ID
  CLASS_SHEET_IDS: {
    "6_A": "SHEET_ID_HERE",
    "6_B": "SHEET_ID_HERE",
    "6_C": "SHEET_ID_HERE",

    "7_A": "SHEET_ID_HERE",
    "7_B": "SHEET_ID_HERE",
    "7_C": "SHEET_ID_HERE",

    "8_A": "SHEET_ID_HERE",
    "8_B": "SHEET_ID_HERE",
    "8_C": "SHEET_ID_HERE",

    "9_SCI": "SHEET_ID_HERE",
    "9_HUM": "SHEET_ID_HERE",
    "9_BUS": "SHEET_ID_HERE",

    "10_SCI": "SHEET_ID_HERE",
    "10_HUM": "SHEET_ID_HERE",
    "10_BUS": "SHEET_ID_HERE"
  }
};
