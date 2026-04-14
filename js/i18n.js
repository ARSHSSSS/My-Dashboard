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

    /* Stats */
    stat_1_desc:         'کارگزاری در سراسر جهان',
    stat_2_desc:         'حساب تحت نظارت',
    stat_3_desc:         'آپ‌تایم تضمین‌شده',
    stat_4_desc:         'ریسک مدیریت‌شده روزانه',

    /* Features section */
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
    feat4_desc:          'مشتریانی که حساب‌های تکراری باز می‌کنند را با استفاده از اثرانگشت دستگاه و تطابق تاریخچه شناسایی کنید. تأیید یا رد با یک کلیک.',
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
  }
};

/* ── Core i18n engine ──────────────────────────── */

const I18N_KEY = 'fg-lang';

function getCurrentLang() {
  return localStorage.getItem(I18N_KEY) || 'en';
}

function setLanguage(code) {
  const t = TRANSLATIONS[code];
  if (!t) return;

  /* Persist */
  localStorage.setItem(I18N_KEY, code);

  /* Translate every element with data-i18n */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  /* RTL toggle */
  const html = document.documentElement;
  if (code === 'fa') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'fa');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
  }

  /* Active state on switcher buttons */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === code);
  });
}

/* ── Init on DOM ready ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const lang = getCurrentLang();
  setLanguage(lang);

  /* Wire up language buttons */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });
});
