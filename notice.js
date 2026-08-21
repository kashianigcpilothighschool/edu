// ============================================================
// 📢 GOOGLE SHEET NOTICE BOARD
// ============================================================

const NOTICE_API =
    'https://script.google.com/macros/s/AKfycbygvl_bV3EQJCeWmi8_UO5VJRDu5KKXPK8_hAOrKWTBpaqsqTiP_nAyJ9eXISxr-MpR/exec';


// ============================================================
// 📢 Notice Load
// ============================================================

async function loadNotices() {

    const noticeList =
        document.getElementById(
            'noticeList'
        );


    if (!noticeList) {
        return;
    }


    // ----------------------------------------------------------
    // Loading
    // ----------------------------------------------------------

    noticeList.innerHTML = `
        <li class="notice-loading">
            <span>নোটিশ লোড হচ্ছে...</span>
        </li>
    `;


    try {

        const response =
            await fetch(
                NOTICE_API +
                '?t=' +
                Date.now(),
                {
                    method: 'GET',
                    cache: 'no-store'
                }
            );


        if (!response.ok) {

            throw new Error(
                'Notice API Error'
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                'Notice loading failed'
            );

        }


        const notices =
            data.notices || [];


        // ------------------------------------------------------
        // কোনো নোটিশ নেই
        // ------------------------------------------------------

        if (
            notices.length === 0
        ) {

            noticeList.innerHTML = `
                <li class="notice-empty">
                    বর্তমানে কোনো নোটিশ প্রকাশিত হয়নি।
                </li>
            `;

            return;

        }


        // ------------------------------------------------------
        // পুরোনো নোটিশ মুছে ফেলুন
        // ------------------------------------------------------

        noticeList.innerHTML = '';


        // ------------------------------------------------------
        // Notice তৈরি
        // ------------------------------------------------------

        notices.forEach(
            function(notice) {

                const li =
                    document.createElement(
                        'li'
                    );


                const link =
                    document.createElement(
                        'a'
                    );


                // URL
                link.href =
                    notice.url;


                // নতুন Tab
                link.target =
                    '_blank';


                // Security
                link.rel =
                    'noopener noreferrer';


                // ------------------------------------------------
                // Title
                // ------------------------------------------------

                const title =
                    document.createElement(
                        'span'
                    );


                title.textContent =
                    notice.title;


                // ------------------------------------------------
                // Date
                // ------------------------------------------------

                const date =
                    document.createElement(
                        'span'
                    );


                date.className =
                    'date';


                date.textContent =
                    notice.date;


                // ------------------------------------------------
                // Append
                // ------------------------------------------------

                link.appendChild(
                    title
                );


                link.appendChild(
                    date
                );


                li.appendChild(
                    link
                );


                noticeList.appendChild(
                    li
                );

            }
        );


    } catch (error) {

        console.error(
            'Notice Board Error:',
            error
        );


        noticeList.innerHTML = `
            <li class="notice-error">
                নোটিশ লোড করা সম্ভব হয়নি।
            </li>
        `;

    }

}


// ============================================================
// 🚀 Page Load
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    function() {

        loadNotices();

    }
);


// ============================================================
// 🔄 প্রতি ৫ মিনিটে Auto Refresh
// ============================================================

setInterval(
    loadNotices,
    5 * 60 * 1000
);
