# Result Transcript System — KGCP High School

Google Apps Script + HTML web app that lets students look up their exam
transcript (marks, GPA, grade, position) by roll number, class, section,
exam name, and year. Data is read from per-class Google Sheets.

## Files

| File | Purpose |
|---|---|
| `Code.gs` | Apps Script backend — reads student rows from the configured Google Sheet and serves them as JSON (`doGet`/`doPost`), or serves the HTML UI when no query params are given. |
| `index.html` | Front-end UI (roll number search form + rendered transcript). |

## Deploying to Google Apps Script

GitHub is just for version control here — the app itself runs on Apps Script, not GitHub Pages, because it needs `SpreadsheetApp` access.

1. Create a new Apps Script project at [script.google.com](https://script.google.com).
2. Copy `Code.gs` in as your script file.
3. Copy `index.html` in as an HTML file, but **rename it to `Transcript`** (i.e. `Transcript.html`) — `Code.gs`'s `doGet()` calls `HtmlService.createHtmlOutputFromFile('Transcript')`, so the filename must match.
4. In `Code.gs`, fill in every `PASTE_SPREADSHEET_ID_...` placeholder inside `SHEET_CONFIG` with the real Google Sheet ID for that exam/class/section (the ID is the long string in the sheet's URL between `/d/` and `/edit`).
5. Deploy → New deployment → **Web app**. Set "Execute as" to yourself and "Who has access" per your school's needs, then deploy and copy the web app URL.

## Sheet format expected

Each linked spreadsheet needs a `Result_Book` sheet with:
- `B3`, `C3`, `D3`, `E3` — class, section, exam name, session (header cells).
- Student rows starting at row 6 (index 5), with roll in column B, name in C, father in D, mother in E, then per-subject CQ/MCQ/total/GPA/grade columns as read by `getStudentResult`.

## API usage

**GET** (returns JSON when all params are present, otherwise serves the HTML UI):
```
https://script.google.com/macros/s/XXXXX/exec?roll=123&class=Six&section=A&examName=Half+Yearly&examYear=2026
```

**POST** (`application/json` body):
```json
{ "action": "getResult", "roll": "123", "className": "Six", "section": "A", "examName": "Half Yearly", "examYear": "2026" }
```

## ⚠️ Before pushing to a public repo

`Code.gs` currently has real Google Sheet IDs hard-coded for the Six/Seven/Eight sections (Half Yearly exam). Sheet IDs aren't secrets by themselves (access is still controlled by the sheet's own sharing settings), but if those sheets are shared "anyone with the link," a public repo effectively publishes the link. Consider either:
- Keeping this repo **private**, or
- Locking down sharing on the underlying Sheets to "restricted," or
- Moving IDs into Apps Script's [`PropertiesService`](https://developers.google.com/apps-script/reference/properties) instead of hard-coding them, if you want the code itself public.
