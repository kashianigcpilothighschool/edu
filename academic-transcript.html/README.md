# CL-Application

Kashiani Girish Chandra Pilot High School এর অনলাইন রেজাল্ট ট্রান্সক্রিপ্ট সিস্টেম।

## ফোল্ডার স্ট্রাকচার

```
CL-Application/
├── index.html          → GitHub Pages এ হোস্ট করা ফ্রন্টএন্ড (রোল নম্বর দিয়ে রেজাল্ট সার্চ)
└── apps-script/
    └── Code.gs          → Google Apps Script ব্যাকএন্ড (Google Sheets থেকে ডেটা ফেচ করে)
```

## কীভাবে কাজ করে

1. `index.html` ইউজারের কাছ থেকে রোল, ক্লাস, সেকশন, পরীক্ষা ও সাল নেয়।
2. এটা Google Apps Script Web App URL এ fetch রিকোয়েস্ট পাঠায়।
3. `apps-script/Code.gs` সংশ্লিষ্ট Google Sheet থেকে ডেটা খুঁজে JSON আকারে রিটার্ন করে।
4. `index.html` সেই JSON দিয়ে ট্রান্সক্রিপ্ট রেন্ডার করে।

## সেটআপ

- **ফ্রন্টএন্ড:** এই রিপোর GitHub Pages চালু করলেই `index.html` লাইভ হয়ে যাবে (Settings → Pages → Branch: main, Folder: / root)।
- **ব্যাকএন্ড:** `apps-script/Code.gs` টা Google Apps Script প্রজেক্টে কপি-পেস্ট করে আলাদাভাবে Web App হিসেবে ডিপ্লয় করতে হবে (GitHub থেকে এটা অটো-ডিপ্লয় হয় না, শুধু কোড ভার্সন-কন্ট্রোলের জন্য এখানে রাখা)।
- `Code.gs` এর `SHEET_CONFIG` এ Nine ও Ten ক্লাসের কিছু Sheet ID এখনো `PASTE_SPREADSHEET_ID...` প্লেসহোল্ডার হিসেবে আছে — সেগুলো আসল Google Sheet ID দিয়ে পূরণ করতে হবে।
