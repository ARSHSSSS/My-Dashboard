/* ══════════════════════════════════════════════════
   ForexGuard — i18n  (Landing page · English + Persian)
   ══════════════════════════════════════════════════ */

const TRANSLATIONS = {

  /* ─── English ─────────────────────────────────── */
  en: {
    /* Navbar */
    nav_features:        'Features',
    nav_howitworks:      'How it works',
    nav_testimonials:    'Testimonials',
    nav_pricing:         'Pricing',
    nav_signin:          'Sign In',
    nav_getstarted:      'Get Started Free',

    /* Hero */
    hero_badge:          '🚀 Trusted by 500+ Forex brokers worldwide',
    hero_h1_line1:       'Risk management',
    hero_h1_line2:       'built for Forex',
    hero_desc:           'Stop juggling spreadsheets and email chains. ForexGuard gives your compliance team a single command centre for account statements, risk alerts, KYC reviews, and client support.',
    hero_cta_primary:    'Get Started Free',
    hero_cta_secondary:  'See How It Works',
    hero_meta_1:         '✓ No credit card required',
    hero_meta_2:         '✓ 5-minute setup',
    hero_meta_3:         '✓ GDPR compliant',

    /* Mockup tabs */
    tab_dashboard:       'Dashboard',
    tab_alerts:          'Risk Alerts',
    tab_kyc:             'KYC Reviews',

    /* Logos bar */
    logos_title:         'Trusted by leading brokers worldwide',

    /* Stats */
    stat_1_desc:         'Brokers worldwide',
    stat_2_desc:         'Accounts monitored',
    stat_3_desc:         'Uptime SLA',
    stat_4_desc:         'Exposure managed daily',

    /* Features section */
    feat_badge:          'Features',
    feat_h2:             'Everything your compliance team needs',
    feat_sub:            'Purpose-built tools that map directly to your daily workflows — no configuration overhead.',
    feat1_title:         'Risk Alerts',
    feat1_desc:          'Real-time alerts for abnormal withdrawal patterns, margin call risks, and repeat account detection. Never miss a critical event.',
    feat2_title:         'Account Statements',
    feat2_desc:          'Review, flag, and approve pending client statements in a structured queue. Full audit trail included.',
    feat3_title:         'KYC Reviews',
    feat3_desc:          'Track document expiry dates, flag incomplete submissions, and manage renewals before they become compliance issues.',
    feat4_title:         'Repeat Account Detection',
    feat4_desc:          'Identify clients opening duplicate accounts using device fingerprinting and history matching. Approve or deny in one click.',
    feat5_title:         'Support Inbox',
    feat5_desc:          'Manage client support emails directly inside the portal. No more switching between tools — your team works in one place.',
    feat6_title:         'Exposure Reports',
    feat6_desc:          'Generate PDF risk reports, track resolved cases over time, and export data for regulatory submissions.',

    /* How it works */
    hiw_badge:           'How it works',
    hiw_h2:              'Up and running in minutes',
    hiw_sub:             'No lengthy onboarding. No dedicated IT team required.',
    step1_title:         'Connect your accounts',
    step1_desc:          'Link your brokerage platform via API or upload account data directly. ForexGuard ingests client and transaction data automatically.',
    step2_title:         'Set your risk thresholds',
    step2_desc:          'Configure alert rules — withdrawal limits, margin ratios, KYC expiry windows — to match your internal compliance policy.',
    step3_title:         'Get alerted instantly',
    step3_desc:          'Your team sees flagged accounts, live risk events, and pending actions the moment they occur — no polling, no delays.',

    /* Testimonials */
    testi_badge:         'Testimonials',
    testi_h2:            'Trusted by compliance teams globally',
    testi1_quote:        '"ForexGuard cut our KYC review time by 60%. Everything that used to live across three spreadsheets and an email inbox is now in one place. Our auditors love the trail it leaves."',
    testi1_name:         'Sarah Brennan',
    testi1_role:         'Chief Compliance Officer · Meridian FX',
    testi2_quote:        '"We went from finding out about repeat accounts days later to catching them in real time. The device fingerprinting alone has saved us from dozens of policy breaches this quarter."',
    testi2_name:         'David Kowalski',
    testi2_role:         'Head of Risk · Atlas Capital Group',
    testi3_quote:        '"The dashboard is clean and fast. My team of 12 agents manages over 40,000 active accounts with it. The alert system means we\'re proactive instead of reactive for the first time."',
    testi3_name:         'Lena Petrov',
    testi3_role:         'Risk Operations Lead · NordBroker',

    /* Pricing */
    price_badge:         'Pricing',
    price_h2:            'Simple, transparent pricing',
    price_sub:           'No hidden fees. Scale as your team grows.',
    plan1_name:          'Starter',
    plan1_price:         '$0',
    plan1_period:        '/mo',
    plan1_desc:          'For small brokers getting started with risk management.',
    plan1_f1:            '✓ Up to 500 active accounts',
    plan1_f2:            '✓ Risk alerts dashboard',
    plan1_f3:            '✓ Account statements queue',
    plan1_f4:            '✓ 1 agent seat',
    plan1_f5:            '✗ KYC tracking',
    plan1_f6:            '✗ Exposure reports',
    plan1_cta:           'Get Started Free',
    plan2_badge:         'Most Popular',
    plan2_name:          'Professional',
    plan2_price:         '$149',
    plan2_period:        '/mo',
    plan2_desc:          'For growing compliance teams managing high account volumes.',
    plan2_f1:            '✓ Unlimited active accounts',
    plan2_f2:            '✓ All risk management tools',
    plan2_f3:            '✓ KYC tracking & expiry alerts',
    plan2_f4:            '✓ Up to 10 agent seats',
    plan2_f5:            '✓ Exposure reports & PDF export',
    plan2_f6:            '✓ Priority support',
    plan2_cta:           'Start Free Trial',
    plan3_name:          'Enterprise',
    plan3_price:         'Custom',
    plan3_desc:          'For large brokers with custom compliance and data requirements.',
    plan3_f1:            '✓ Everything in Professional',
    plan3_f2:            '✓ Unlimited agent seats',
    plan3_f3:            '✓ Custom API integrations',
    plan3_f4:            '✓ SSO & advanced permissions',
    plan3_f5:            '✓ Dedicated account manager',
    plan3_f6:            '✓ SLA guarantee',
    plan3_cta:           'Contact Sales',

    /* FAQ */
    faq_badge:           'FAQ',
    faq_h2:              'Frequently asked questions',
    faq_1_q:             'Is my data secure?',
    faq_1_a:             'All data is stored in your browser\'s localStorage — nothing is sent to external servers. ForexGuard runs entirely client-side, so your compliance data never leaves your device.',
    faq_2_q:             'Can I use it completely for free?',
    faq_2_a:             'Yes. The Starter plan is completely free with up to 500 active accounts and core risk management tools. No credit card required, no time limit.',
    faq_3_q:             'Do I need IT support to set it up?',
    faq_3_a:             'No. ForexGuard runs in any modern browser with zero installation or configuration. Most teams are up and running in under 5 minutes.',
    faq_4_q:             'How many agents can use the dashboard?',
    faq_4_a:             'The Starter plan includes 1 agent seat. Professional supports up to 10 agents. Enterprise offers unlimited seats with role-based access control.',
    faq_5_q:             'What happens when I reach the free plan limit?',
    faq_5_a:             'You\'ll receive an in-app notification when approaching 500 accounts. Upgrading to Professional unlocks unlimited accounts and all advanced features instantly.',
    faq_6_q:             'Is ForexGuard GDPR compliant?',
    faq_6_a:             'Yes. Since all data remains in your browser and is never transmitted to third-party servers, ForexGuard inherently satisfies GDPR data residency and privacy requirements.',

    /* CTA Banner */
    cta_h2:              'Start managing risk today',
    cta_sub:             'Join 500+ brokers who use ForexGuard to stay ahead of compliance failures.',
    cta_primary:         'Get Started Free',
    cta_secondary:       'Sign In →',

    /* Footer */
    footer_brand_desc:   'The risk management portal built for Forex compliance teams. Monitor everything. Miss nothing.',
    footer_col1_title:   'Product',
    footer_col1_l1:      'Features',
    footer_col1_l2:      'Pricing',
    footer_col1_l3:      'How it works',
    footer_col1_l4:      'Dashboard',
    footer_col2_title:   'Company',
    footer_col2_l1:      'About',
    footer_col2_l2:      'Blog',
    footer_col2_l3:      'Careers',
    footer_col2_l4:      'Press',
    footer_col3_title:   'Legal',
    footer_col3_l1:      'Privacy Policy',
    footer_col3_l2:      'Terms of Service',
    footer_col3_l3:      'Cookie Policy',
    footer_col3_l4:      'GDPR',
    footer_copy:         '© 2026 ForexGuard. All rights reserved.',
    footer_status:       'Status',
    footer_security:     'Security',
    footer_github:       'GitHub',

    /* Cookie banner */
    cookie_text:         '🍪 We use localStorage to save your theme and preferences only — no tracking, no third-party cookies.',
    cookie_accept:       'Got it',
  },

  /* ─── Persian (Farsi) ─────────────────────────── */
  fa: {
    /* Navbar */
    nav_features:        'امکانات',
    nav_howitworks:      'نحوه کارکرد',
    nav_testimonials:    'نظرات کاربران',
    nav_pricing:         'قیمت‌گذاری',
    nav_signin:          'ورود',
    nav_getstarted:      'شروع رایگان',

    /* Hero */
    hero_badge:          '🚀 مورد اعتماد بیش از ۵۰۰ کارگزاری فارکس در سراسر جهان',
    hero_h1_line1:       'مدیریت ریسک',
    hero_h1_line2:       'ساخته‌شده برای فارکس',
    hero_desc:           'دیگر نیازی به کار با صفحات گسترده و زنجیره‌های ایمیل ندارید. ForexGuard به تیم انطباق شما یک مرکز فرمان واحد برای صورت‌حساب‌ها، هشدارهای ریسک، بررسی KYC و پشتیبانی مشتریان می‌دهد.',
    hero_cta_primary:    'شروع رایگان',
    hero_cta_secondary:  'نحوه کارکرد را ببینید',
    hero_meta_1:         '✓ بدون نیاز به کارت اعتباری',
    hero_meta_2:         '✓ راه‌اندازی ۵ دقیقه‌ای',
    hero_meta_3:         '✓ سازگار با GDPR',

    /* Mockup tabs */
    tab_dashboard:       'داشبورد',
    tab_alerts:          'هشدارهای ریسک',
    tab_kyc:             'بررسی KYC',

    /* Logos bar */
    logos_title:         'مورد اعتماد کارگزاری‌های پیشرو در سراسر جهان',

    /* Stats */
    stat_1_desc:         'کارگزاری در سراسر جهان',
    stat_2_desc:         'حساب تحت نظارت',
    stat_3_desc:         'آپ‌تایم تضمین‌شده',
    stat_4_desc:         'ریسک مدیریت‌شده روزانه',

    /* Features */
    feat_badge:          'امکانات',
    feat_h2:             'همه چیزی که تیم انطباق شما نیاز دارد',
    feat_sub:            'ابزارهایی که مستقیماً با گردش‌کار روزانه شما تطابق دارند — بدون پیچیدگی تنظیمات.',
    feat1_title:         'هشدارهای ریسک',
    feat1_desc:          'هشدارهای لحظه‌ای برای الگوهای برداشت غیرعادی، خطر مارجین کال و شناسایی حساب‌های تکراری. هیچ رویداد مهمی را از دست ندهید.',
    feat2_title:         'صورت‌حساب‌های حساب',
    feat2_desc:          'صورت‌حساب‌های معلق مشتریان را در یک صف ساختارمند بررسی، علامت‌گذاری و تأیید کنید. مسیر حسابرسی کامل ارائه می‌شود.',
    feat3_title:         'بررسی KYC',
    feat3_desc:          'تاریخ انقضای مدارک را ردیابی کنید، ارسال‌های ناقص را علامت بزنید و تمدیدها را قبل از تبدیل شدن به مشکلات انطباق مدیریت کنید.',
    feat4_title:         'شناسایی حساب تکراری',
    feat4_desc:          'مشتریانی که حساب‌های تکراری باز می‌کنند را با اثرانگشت دستگاه و تطابق تاریخچه شناسایی کنید. تأیید یا رد با یک کلیک.',
    feat5_title:         'صندوق پشتیبانی',
    feat5_desc:          'ایمیل‌های پشتیبانی مشتریان را مستقیماً در داخل پرتال مدیریت کنید. دیگر نیازی به جابجایی بین ابزارها نیست.',
    feat6_title:         'گزارش‌های ریسک',
    feat6_desc:          'گزارش‌های PDF ریسک تولید کنید، موارد حل‌شده را در طول زمان ردیابی کنید و داده‌ها را برای ارسال به مراجع نظارتی صادر کنید.',

    /* How it works */
    hiw_badge:           'نحوه کارکرد',
    hiw_h2:              'در چند دقیقه راه‌اندازی و اجرا کنید',
    hiw_sub:             'بدون آموزش طولانی. بدون نیاز به تیم IT اختصاصی.',
    step1_title:         'حساب‌های خود را متصل کنید',
    step1_desc:          'پلتفرم کارگزاری خود را از طریق API متصل کنید یا داده‌های حساب را مستقیماً آپلود کنید. ForexGuard به‌طور خودکار داده‌های مشتری و تراکنش را پردازش می‌کند.',
    step2_title:         'آستانه‌های ریسک خود را تنظیم کنید',
    step2_desc:          'قوانین هشدار را پیکربندی کنید — محدودیت‌های برداشت، نسبت‌های مارجین، بازه‌های انقضای KYC — تا با سیاست انطباق داخلی شما مطابقت داشته باشند.',
    step3_title:         'فوری مطلع شوید',
    step3_desc:          'تیم شما در لحظه‌ای که حساب‌های علامت‌گذاری‌شده، رویدادهای ریسک زنده و اقدامات معلق رخ می‌دهند آن‌ها را می‌بیند — بدون تأخیر.',

    /* Testimonials */
    testi_badge:         'نظرات کاربران',
    testi_h2:            'مورد اعتماد تیم‌های انطباق در سراسر جهان',
    testi1_quote:        '«ForexGuard زمان بررسی KYC ما را ۶۰٪ کاهش داد. همه چیزی که قبلاً در سه صفحه‌گسترده و یک صندوق ایمیل پراکنده بود اکنون در یک جا است. حسابرسان ما عاشق مسیر حسابرسی آن هستند.»',
    testi1_name:         'سارا برنان',
    testi1_role:         'مدیر ارشد انطباق · Meridian FX',
    testi2_quote:        '«از اینکه روزها بعد از حساب‌های تکراری باخبر می‌شدیم، به شناسایی لحظه‌ای رسیدیم. همین اثرانگشت دستگاه به تنهایی ما را از ده‌ها نقض سیاست در این فصل نجات داد.»',
    testi2_name:         'دیوید کووالسکی',
    testi2_role:         'مدیر ریسک · Atlas Capital Group',
    testi3_quote:        '«داشبورد تمیز و سریع است. تیم ۱۲ نفره من با آن بیش از ۴۰٬۰۰۰ حساب فعال را مدیریت می‌کند. سیستم هشدار به این معناست که برای اولین بار به جای واکنش‌گرا، پیشگیرانه عمل می‌کنیم.»',
    testi3_name:         'لنا پتروف',
    testi3_role:         'سرپرست عملیات ریسک · NordBroker',

    /* Pricing */
    price_badge:         'قیمت‌گذاری',
    price_h2:            'قیمت‌گذاری ساده و شفاف',
    price_sub:           'بدون هزینه‌های پنهان. همگام با رشد تیم شما.',
    plan1_name:          'استارتر',
    plan1_price:         '$0',
    plan1_period:        '/ماه',
    plan1_desc:          'برای کارگزاری‌های کوچکی که تازه شروع به مدیریت ریسک می‌کنند.',
    plan1_f1:            '✓ تا ۵۰۰ حساب فعال',
    plan1_f2:            '✓ داشبورد هشدارهای ریسک',
    plan1_f3:            '✓ صف صورت‌حساب‌های حساب',
    plan1_f4:            '✓ ۱ صندلی کارشناس',
    plan1_f5:            '✗ ردیابی KYC',
    plan1_f6:            '✗ گزارش‌های ریسک',
    plan1_cta:           'شروع رایگان',
    plan2_badge:         'محبوب‌ترین',
    plan2_name:          'حرفه‌ای',
    plan2_price:         '$149',
    plan2_period:        '/ماه',
    plan2_desc:          'برای تیم‌های انطباق در حال رشد که حجم بالایی از حساب‌ها را مدیریت می‌کنند.',
    plan2_f1:            '✓ حساب‌های فعال نامحدود',
    plan2_f2:            '✓ همه ابزارهای مدیریت ریسک',
    plan2_f3:            '✓ ردیابی KYC و هشدار انقضا',
    plan2_f4:            '✓ تا ۱۰ صندلی کارشناس',
    plan2_f5:            '✓ گزارش‌های ریسک و صادرکردن PDF',
    plan2_f6:            '✓ پشتیبانی اولویت‌دار',
    plan2_cta:           'شروع آزمایش رایگان',
    plan3_name:          'سازمانی',
    plan3_price:         'سفارشی',
    plan3_desc:          'برای کارگزاری‌های بزرگ با الزامات انطباق و داده‌های سفارشی.',
    plan3_f1:            '✓ همه چیز در حرفه‌ای',
    plan3_f2:            '✓ صندلی کارشناس نامحدود',
    plan3_f3:            '✓ یکپارچه‌سازی‌های API سفارشی',
    plan3_f4:            '✓ SSO و مجوزهای پیشرفته',
    plan3_f5:            '✓ مدیر حساب اختصاصی',
    plan3_f6:            '✓ ضمانت SLA',
    plan3_cta:           'تماس با فروش',

    /* FAQ */
    faq_badge:           'سوالات متداول',
    faq_h2:              'سوالات پرتکرار',
    faq_1_q:             'آیا داده‌های من امن است؟',
    faq_1_a:             'تمام داده‌ها در localStorage مرورگر شما ذخیره می‌شوند — هیچ چیزی به سرورهای خارجی ارسال نمی‌شود. ForexGuard کاملاً سمت کلاینت اجرا می‌شود و اطلاعات انطباق شما هرگز دستگاهتان را ترک نمی‌کند.',
    faq_2_q:             'آیا می‌توانم کاملاً رایگان استفاده کنم؟',
    faq_2_a:             'بله. پلن استارتر کاملاً رایگان است با تا ۵۰۰ حساب فعال و ابزارهای اصلی مدیریت ریسک. بدون نیاز به کارت اعتباری، بدون محدودیت زمانی.',
    faq_3_q:             'آیا برای راه‌اندازی به پشتیبانی IT نیاز دارم؟',
    faq_3_a:             'خیر. ForexGuard در هر مرورگر مدرنی بدون نصب یا پیکربندی اجرا می‌شود. اکثر تیم‌ها در کمتر از ۵ دقیقه شروع به کار می‌کنند.',
    faq_4_q:             'چند کارشناس می‌توانند از داشبورد استفاده کنند؟',
    faq_4_a:             'پلن استارتر شامل ۱ صندلی کارشناس است. حرفه‌ای تا ۱۰ کارشناس را پشتیبانی می‌کند. سازمانی دارای صندلی‌های نامحدود با کنترل دسترسی مبتنی بر نقش است.',
    faq_5_q:             'وقتی به محدودیت پلن رایگان رسیدم چه اتفاقی می‌افتد؟',
    faq_5_a:             'هنگام نزدیک شدن به ۵۰۰ حساب یک اعلان درون‌برنامه دریافت خواهید کرد. ارتقا به حرفه‌ای بلافاصله حساب‌های نامحدود و همه ویژگی‌های پیشرفته را فعال می‌کند.',
    faq_6_q:             'آیا ForexGuard با GDPR سازگار است؟',
    faq_6_a:             'بله. از آنجایی که تمام داده‌ها در مرورگر شما باقی می‌مانند و هرگز به سرورهای شخص ثالث منتقل نمی‌شوند، ForexGuard به طور ذاتی الزامات حریم خصوصی GDPR را برآورده می‌کند.',

    /* CTA Banner */
    cta_h2:              'همین امروز مدیریت ریسک را شروع کنید',
    cta_sub:             'به بیش از ۵۰۰ کارگزاری بپیوندید که از ForexGuard برای جلوتر ماندن از شکست‌های انطباق استفاده می‌کنند.',
    cta_primary:         'شروع رایگان',
    cta_secondary:       'ورود ←',

    /* Footer */
    footer_brand_desc:   'پرتال مدیریت ریسک ساخته‌شده برای تیم‌های انطباق فارکس. همه چیز را رصد کنید. هیچ‌چیز را از دست ندهید.',
    footer_col1_title:   'محصول',
    footer_col1_l1:      'امکانات',
    footer_col1_l2:      'قیمت‌گذاری',
    footer_col1_l3:      'نحوه کارکرد',
    footer_col1_l4:      'داشبورد',
    footer_col2_title:   'شرکت',
    footer_col2_l1:      'درباره ما',
    footer_col2_l2:      'وبلاگ',
    footer_col2_l3:      'فرصت‌های شغلی',
    footer_col2_l4:      'رسانه',
    footer_col3_title:   'حقوقی',
    footer_col3_l1:      'سیاست حریم خصوصی',
    footer_col3_l2:      'شرایط خدمات',
    footer_col3_l3:      'سیاست کوکی',
    footer_col3_l4:      'GDPR',
    footer_copy:         '© ۲۰۲۶ ForexGuard. تمامی حقوق محفوظ است.',
    footer_status:       'وضعیت',
    footer_security:     'امنیت',
    footer_github:       'گیت‌هاب',

    /* Cookie banner */
    cookie_text:         '🍪 ما فقط از localStorage برای ذخیره تم و تنظیمات شما استفاده می‌کنیم — بدون ردیابی، بدون کوکی شخص ثالث.',
    cookie_accept:       'متوجه شدم',
  }
};

/* ══════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════ */

const FARSI_DIGITS = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];

function toFarsiDigits(str) {
  return String(str).replace(/[0-9]/g, d => FARSI_DIGITS[+d]);
}

function getCurrentLang() {
  return localStorage.getItem('fg-lang') || 'en';
}

/* ══════════════════════════════════════════════════
   Core engine
   ══════════════════════════════════════════════════ */

const I18N_KEY = 'fg-lang';

function setLanguage(code) {
  const t = TRANSLATIONS[code];
  if (!t) return;

  /* Fade out */
  document.body.classList.add('lang-switching');

  setTimeout(() => {
    /* Persist */
    localStorage.setItem(I18N_KEY, code);

    /* Translate every [data-i18n] element */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });

    /* RTL / LTR */
    const html = document.documentElement;
    if (code === 'fa') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'fa');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
    }

    /* Re-render animated stat counters with correct digit set */
    document.querySelectorAll('.stat-count[data-current]').forEach(el => {
      const val = el.getAttribute('data-current');
      el.textContent = code === 'fa' ? toFarsiDigits(val) : val;
    });

    /* Active state on switcher buttons */
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === code);
    });

    /* Fade back in */
    document.body.classList.remove('lang-switching');
  }, 150);
}

/* ══════════════════════════════════════════════════
   Init on DOM ready
   ══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(getCurrentLang());

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });
});
