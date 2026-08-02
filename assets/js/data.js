/* ============================================================
   NOVEXA ERP — SAMPLE DATA (data.js)
   Persian sample data + formatting helpers
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- Persian digit helpers ---------- */
  const FA = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  function toFa(n) {
    if (n === null || n === undefined || n === '') return '';
    return String(n).replace(/[0-9]/g, (d) => FA[+d]);
  }
  function faNum(n) {
    if (n === null || n === undefined) return '—';
    return toFa(Number(n).toLocaleString('en-US'));
  }
  function faMoney(n) {
    if (n === null || n === undefined) return '—';
    return toFa(Number(n).toLocaleString('en-US'));
  }
  function faDate(g) {
    // Simulated Jalali display (static strings for prototype)
    return g || '۱۴۰۳/۰۷/۱۲';
  }

  /* ---------- Persian words ---------- */
  const WORDS = {
    daysAgo: (n) => `${toFa(n)} روز پیش`,
    hoursAgo: (n) => `${toFa(n)} ساعت پیش`,
    minsAgo: (n) => `${toFa(n)} دقیقه پیش`,
    justNow: 'هم‌اکنون',
    today: 'امروز',
    yesterday: 'دیروز'
  };

  /* ---------- People (Persian names) ---------- */
  const FIRST = ['محمد','علی','رضا','حسین','امیر','مهدی','میلاد','پویا','سینا','آرش','بهنام','کارن','سهراب','بابک','کاوه','فرزاد','نیما','پدرام','شهاب','کسری','سارا','نگار','الهام','پریسا','مریم','زهرا','فاطمه','شکوفه','نیلوفر','آیدا','رؤیا','مهسا','یاسمن','هانیه','الناز','دنیا','سمیرا','گلناز'];
  const LAST = ['محمدی','حسینی','رضایی','کریمی','احمدی','موسوی','صادقی','نوری','جعفری','اکبری','قاسمی','علی‌پور','رستمی','شریفی','مرادی','کاظمی','زمانی','تهرانی','شیرازی','ابراهیمی','صالحی','فلاح','بهرامی','گلستانی','درویشی','سلطانی','نظری','توحیدی','خسروی','امینی'];
  const CITIES = ['تهران','مشهد','اصفهان','شیراز','تبریز','کرج','اهواز','قم','کرمانشاه','رشت','زاهدان','ارومیه','همدان','سنندج','بندرعباس','یزد','کرمان','اردبیل','بابل','ساری','گرگان','قزوین','خرم‌آباد','زنجان','بجنورد','ایلام'];
  const COMPANY = ['فناوری','پیشرو','نوین','آریا','سپه','پارس','البرز','زمرد','دلتا','گستر','ساخت','صنعت','بازرگانی','پخش','توسعه','سرمايه','پردیس','مهر','آسمان','کیان','سهند','دماوند','نیک‌اندیش','پیشگام','اندیشه‌ساز','آفریند','سورن','رایکا','مهرگان','پادینا'];
  const COMPANY_SUFFIX = ['','شرکت','گروه','هولدینگ','صنایع','بازرگانی'];
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function fullName(){ return pick(FIRST) + ' ' + pick(LAST); }
  function initials(name){ return name.split(' ').map(s=>s[0]).slice(0,2).join(''); }
  function companyName(){ return (pick(['شرکت','گروه']) + ' ' + pick(COMPANY) + ' ' + pick(['','صنعت','پیشرو','آریا'])).trim(); }
  function phone(){ return '۰۹' + toFa(String(Math.floor(10 + Math.random()*89))) + ' ' + toFa(String(Math.floor(1000000 + Math.random()*8999999)).padStart(7,'0')); }
  function tel(){ return '۰۲۱-' + toFa(String(Math.floor(10000000 + Math.random()*89999999))); }

  /* ---------- Categories ---------- */
  const CATEGORIES = [
    { id:1, name:'کالای دیجیتال', slug:'digital', parent:null, count:128, color:'#2563EB', icon:'cpu' },
    { id:2, name:'موبایل و تبلت', slug:'mobile', parent:1, count:64, color:'#3B82F6', icon:'package' },
    { id:3, name:'لپ‌تاپ و کامپیوتر', slug:'laptop', parent:1, count:42, color:'#06B6D4', icon:'server' },
    { id:4, name:'لوازم خانگی', slug:'home', parent:null, count:96, color:'#22C55E', icon:'home' },
    { id:5, name:'صوتی و تصویری', slug:'audio', parent:1, count:31, color:'#F59E0B', icon:'grid' },
    { id:6, name:'پوشاک', slug:'fashion', parent:null, count:212, color:'#7C3AED', icon:'tag' },
    { id:7, name:'مواد غذایی', slug:'food', parent:null, count:184, color:'#EF4444', icon:'shopping' },
    { id:8, name:'آرایشی و بهداشتی', slug:'beauty', parent:null, count:73, color:'#EC4899', icon:'gift' },
    { id:9, name:'کتاب و لوازم تحریر', slug:'book', parent:null, count:58, color:'#0F172A', icon:'file' }
  ];

  /* ---------- Brands ---------- */
  const PRODUCT_BRANDS = ['سامسونگ','اپل','شیائومی','هوآوی','ال‌جی','سونی','آسوس','لنوو','هیولت‌پاکارد','دل','ایسوس','مایکروسافت','کنون','نیکون','جی‌بی‌ال','بوش','فیلیپس','پاناسونیک','توشیبا','اکسریا','اسنوا','گاسد'];
  const DEVICE_BRANDS = ['iPhone','Galaxy','Redmi','Mate','Xperia','Pixel','OnePlus','Surface','MacBook','ThinkPad','Pavilion','Rog'];
  const DEVICE_MODELS = ['Pro 15','Ultra 13','Max 12','Lite 11','SE 2nd','Plus','Neo','Air','Mini','Tab S9','Flip','Book X'];

  /* ---------- Units ---------- */
  const UNITS = [
    { id:1, code:'عدد', name:'عدد', symbol:'pcs' },
    { id:2, code:'کیلوگرم', name:'کیلوگرم', symbol:'kg' },
    { id:3, code:'گرم', name:'گرم', symbol:'g' },
    { id:4, code:'لیتر', name:'لیتر', symbol:'L' },
    { id:5, code:'متر', name:'متر', symbol:'m' },
    { id:6, code:'جعبه', name:'جعبه', symbol:'box' },
    { id:7, code:'کارتن', name:'کارتن', symbol:'ctn' },
    { id:8, code:'دستگاه', name:'دستگاه', symbol:'unit' },
    { id:9, code:'بسته', name:'بسته', symbol:'pack' },
    { id:10, code:'قوطی', name:'قوطی', symbol:'can' }
  ];

  /* ---------- Products ---------- */
  const PRODUCT_NAMES = [
    'گوشی هوشمند سامسونگ Galaxy S24 Ultra ۵۱۲ گیگابایت',
    'لپ‌تاپ اپل MacBook Pro 14 اینچ M3 Pro',
    'هدفون بی‌سیم سونی WH-1000XM5 نویزکنسلینگ',
    'تبلت اپل iPad Air 5 نسل پنجم ۲۵۶ گیگابایت',
    'ساعت هوشمند اپل واچ سری ۹ ۴۵ میلی‌متری',
    'لپ‌تاپ ایسوس ROG Strix G16 گیمینگ',
    'گوشی شیائومی Redmi Note 13 Pro ۸/۲۵۶',
    'هدفون ایرپاد پرو نسل دوم اپل',
    'تلویزیون ال‌جی OLED C3 ۶۵ اینچ ۴K',
    'کنسول بازی پلی‌استیشن ۵ نسخه استاندارد',
    'ماوس بی‌سیم لاجیتک MX Master 3S',
    'کیبورد مکانیکی کی‌کرام K2 Pro',
    'هارد اکسترنال وسترن دیجیتال ۲ ترابایت',
    'اسپیکر بلوتوثی جی‌بی‌ال Charge 5',
    'دوربین دیجیتال کانن EOS R6 Mark II بدنه',
    'پاوربانک انکر ۲۰۰۰۰ میلی‌آمپر ۳۰ وات',
    'شارژر فست شارژ سامسونگ ۴۵ وات',
    'مایکروفون کاندنسر بلو یتی الگو',
    'وب‌کم لاجیتک بریو ۴K پرو',
    'پرینتر لیزری اچ‌پی Color LaserJet Pro',
    'یخچال فریزر دو درب ال‌جی ۵۸۰ لیتری',
    'ماشین لباسشویی بوش ۹ کیلوگرمی اینورتر',
    'مایکروویو پاناسونیک ۳۲ لیتری گریل',
    'جاروبرقی فیلیپس بدون کیسه ۲۲۰۰ وات',
    'بخاری برقی گرمیسم smart ۲۴۰۰ وات',
    'تصفیه‌هوای هوآوی smart ۴۸۰ مترمکعب',
    'چای‌ساز برقی تلفورد استیل ضد زنگ',
    'همزن برقی فیلیپس ۸۰۰ وات پرومیکس',
    'توستر ۴ تکه بوش ۱۸۰۰ وات نقره‌ای',
    'سشوار حرفه‌ای بابلیس pro ۲۴۰۰ وات'
  ];

  function buildProducts(n) {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const cat = pick(CATEGORIES.filter(c => c.parent));
      const brand = pick(PRODUCT_BRANDS);
      const sku = 'NV-' + toFa(String(10048 + i));
      const stock = Math.floor(Math.random()*400);
      const cost = Math.floor(500000 + Math.random()*45000000);
      const price = Math.floor(cost * (1.12 + Math.random()*0.6));
      rows.push({
        id: 1000 + i,
        sku,
        name: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
        brand,
        category: cat.name,
        unit: pick(UNITS).name,
        stock,
        minStock: Math.floor(Math.random()*40) + 10,
        cost,
        price,
        status: stock < 20 ? 'low' : (stock > 300 ? 'over' : 'active'),
        barcode: '6' + String(260000000000 + Math.floor(Math.random()*99999999999)),
        image: '',
        created: faDate('۱۴۰۳/۰۴/' + toFa(1 + (i%30)))
      });
    }
    return rows;
  }

  /* ---------- Customers ---------- */
  function buildCustomers(n) {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const isCompany = Math.random() > 0.45;
      const name = isCompany ? companyName() : fullName();
      const balance = Math.floor(Math.random()*400000000) - 80000000;
      rows.push({
        id: 2000 + i,
        code: 'C-' + toFa(String(1200 + i)),
        name,
        type: isCompany ? 'حقوقی' : 'حقیقی',
        phone: phone(),
        email: 'info' + (i+1) + '@novexa.ir',
        nationalId: '۰۰' + toFa(String(Math.floor(1000000000 + Math.random()*8999999999))),
        city: pick(CITIES),
        address: pick(CITIES) + '، خیابان ' + pick(['ولیعصر','آزادی','انقلاب','فردوسی','مفید','نلسون ماندلا']) + '، پلاک ' + toFa(String(Math.floor(Math.random()*200)+1)),
        balance,
        orders: Math.floor(Math.random()*120),
        status: pick(['active','active','active','inactive']),
        credit: Math.floor(Math.random()*50000000),
        created: faDate('۱۴۰۲/' + toFa(1 + (i%12)) + '/' + toFa(1 + (i%28)))
      });
    }
    return rows;
  }

  /* ---------- Suppliers ---------- */
  function buildSuppliers(n) {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const name = companyName() + ' ' + pick(COMPANY_SUFFIX);
      rows.push({
        id: 3000 + i,
        code: 'S-' + toFa(String(800 + i)),
        name,
        contact: fullName(),
        phone: tel(),
        mobile: phone(),
        email: 'sales' + (i+1) + '@supplier.ir',
        economicCode: toFa(String(Math.floor(100000000 + Math.random()*899999999))),
        city: pick(CITIES),
        category: pick(CATEGORIES).name,
        rating: Math.round((3 + Math.random()*2) * 10) / 10,
        totalPurchase: Math.floor(200000000 + Math.random()*5000000000),
        payable: Math.floor(Math.random()*300000000),
        status: pick(['active','active','active','inactive']),
        created: faDate('۱۴۰۱/' + toFa(1 + (i%12)) + '/' + toFa(1 + (i%28)))
      });
    }
    return rows;
  }

  /* ---------- Purchase Orders ---------- */
  const PO_STATUSES = [
    { key:'draft', label:'پیش‌نویس', cls:'neutral' },
    { key:'pending', label:'در انتظار تأیید', cls:'warning' },
    { key:'approved', label:'تأیید شده', cls:'info' },
    { key:'shipping', label:'در حال ارسال', cls:'info' },
    { key:'received', label:'تحویل شده', cls:'success' },
    { key:'canceled', label:'لغو شده', cls:'danger' }
  ];
  function buildPurchaseOrders(n) {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const sup = companyName();
      const st = pick(PO_STATUSES);
      const total = Math.floor(8000000 + Math.random()*400000000);
      rows.push({
        id: 'PO-' + toFa(String(50210 + i)),
        supplier: sup,
        date: faDate('۱۴۰۳/۰' + toFa(1+(i%7)) + '/' + toFa(1+(i%28))),
        delivery: faDate('۱۴۰۳/۰' + toFa(2+(i%6)) + '/' + toFa(5+(i%23))),
        items: Math.floor(1 + Math.random()*25),
        total,
        paid: Math.random() > 0.5 ? Math.floor(total*0.6) : total,
        status: st.key,
        statusLabel: st.label,
        statusCls: st.cls,
        warehouse: pick(['انبار مرکزی تهران','انبار پردیس','انبار شیراز','انبار اصفهان'])
      });
    }
    return rows;
  }

  /* ---------- Sales ---------- */
  const SALE_STATUSES = [
    { key:'pending', label:'در انتظار', cls:'warning' },
    { key:'processing', label:'در حال پردازش', cls:'info' },
    { key:'shipped', label:'ارسال شده', cls:'info' },
    { key:'delivered', label:'تحویل شده', cls:'success' },
    { key:'returned', label:'مرجوع شده', cls:'danger' },
    { key:'canceled', label:'لغو شده', cls:'neutral' }
  ];
  function buildSales(n) {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const cust = Math.random() > 0.5 ? companyName() : fullName();
      const st = pick(SALE_STATUSES);
      const total = Math.floor(1200000 + Math.random()*80000000);
      rows.push({
        id: 'INV-' + toFa(String(10240 + i)),
        customer: cust,
        date: faDate('۱۴۰۳/۰' + toFa(1+(i%7)) + '/' + toFa(1+(i%28))),
        items: Math.floor(1 + Math.random()*15),
        total,
        paid: st.key==='delivered' ? total : Math.floor(total*0.3),
        channel: pick(['فروشگاه آنلاین','حضوری','تلفنی','نمایندگی']),
        payment: pick(['نقدی','اقساطی','اعتباری','چکی']),
        status: st.key,
        statusLabel: st.label,
        statusCls: st.cls
      });
    }
    return rows;
  }

  /* ---------- Inventory transactions ---------- */
  const TX_TYPES = [
    { key:'in', label:'ورود کالا', cls:'success' },
    { key:'out', label:'خروج کالا', cls:'danger' },
    { key:'transfer', label:'انتقال', cls:'info' },
    { key:'adjust', label:'تعدیل', cls:'warning' },
    { key:'return', label:'مرجوعی', cls:'info' }
  ];
  function buildInventoryTx(n) {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const t = pick(TX_TYPES);
      const qty = Math.floor(1 + Math.random()*400);
      rows.push({
        id: 'TX-' + toFa(String(88200 + i)),
        product: pick(PRODUCT_NAMES),
        type: t.key,
        typeLabel: t.label,
        typeCls: t.cls,
        qty,
        from: t.key==='out' ? pick(['انبار مرکزی','انبار پردیس']) : (t.key==='in' ? 'تأمین‌کننده' : pick(['انبار مرکزی','انبار پردیس'])),
        to: pick(['انبار مرکزی','انبار پردیس','فروش','مرجوعی']),
        user: fullName(),
        date: faDate('۱۴۰۳/۰' + toFa(1+(i%7)) + '/' + toFa(1+(i%28))) + ' - ' + toFa(String(Math.floor(Math.random()*24)).padStart(2,'0')) + ':' + toFa(String(Math.floor(Math.random()*60)).padStart(2,'0')),
        ref: pick(['PO-' + toFa(50210+i%9), 'INV-' + toFa(10240+i%7), '—'])
      });
    }
    return rows;
  }

  /* ---------- Users ---------- */
  const ROLES = ['مدیر سیستم','مدیر فروش','مدیر انبار','مدیر مالی','کارشناس فروش','کارشناس انبار','کارشناس خرید','حسابدار','اپراتور'];
  function buildUsers(n) {
    const rows = [];
    for (let i = 0; i < n; i++) {
      const name = fullName();
      rows.push({
        id: 4000 + i,
        name,
        username: name.split(' ')[0] + Math.floor(10+Math.random()*89),
        email: name.split(' ')[0].toLowerCase() + '@novexa.ir',
        role: pick(ROLES),
        department: pick(['مدیریت','فروش','انبار','مالی','خرید','فناوری اطلاعات']),
        city: pick(CITIES),
        phone: phone(),
        lastLogin: faDate('۱۴۰۳/۰' + toFa(1+(i%7)) + '/' + toFa(1+(i%28))) + ' ' + toFa(String(8+(i%12))) + ':' + toFa(String(10+(i%40))),
        status: pick(['active','active','active','inactive','pending']),
        avatar: ''
      });
    }
    return rows;
  }

  /* ---------- Notifications ---------- */
  const NOTIFS = [
    { icon:'box', color:'success', title:'محموله جدید تحویل انبار شد', body:'سفارش خرید PO-۵۰۲۱۰ مربوط به گوشی‌های سامسونگ تحویل داده شد', time:'۱۰ دقیقه پیش', unread:true, cat:'انبار' },
    { icon:'cart', color:'info', title:'سفارش فروش جدید ثبت شد', body:'سفارش INV-۱۰۲۸۴ به مبلغ ۱۲٫۵ میلیون تومان توسط سارا محمدی', time:'۳۵ دقیقه پیش', unread:true, cat:'فروش' },
    { icon:'alert', color:'warning', title:'هشدار موجودی کم', body:'محصول «هدفون سونی WH-۱۰۰۰XM5» به کمتر از حد مجاز رسید', time:'۱ ساعت پیش', unread:true, cat:'انبار' },
    { icon:'dollar', color:'success', title:'پرداخت مورد تأیید قرار گرفت', body:'فاکتور شماره INV-۱۰۲۷۵ به مبلغ ۸٫۲ میلیون تومان تسویه شد', time:'۲ ساعت پیش', unread:false, cat:'مالی' },
    { icon:'user', color:'info', title:'مشتری جدید ثبت شد', body:'شرکت گسترش آریا صنعت به‌عنوان مشتری حقوقی اضافه شد', time:'۴ ساعت پیش', unread:false, cat:'فروش' },
    { icon:'shield', color:'danger', title:'تلاش ناموفق ورود', body:'۳ تلاش ناموفق برای ورود به حساب کاربری milad.m از IP نامشخص', time:'۵ ساعت پیش', unread:false, cat:'امنیت' },
    { icon:'package', color:'info', title:'درخواست انتقال کالا', body:'انتقال ۲۵۰ دستگاه از انبار مرکزی به انبار پردیس در انتظار تأیید', time:'دیروز، ۱۴:۲۰', unread:false, cat:'انبار' },
    { icon:'chart', color:'primary', title:'گزارش ماهانه آماده است', body:'گزارش عملکرد فروش مهرماه ۱۴۰۳ برای مشاهده آماده شد', time:'دیروز، ۰۹:۰۰', unread:false, cat:'گزارش' }
  ];

  /* ---------- Activities (timeline) ---------- */
  function buildActivities(n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      const user = fullName();
      arr.push({
        type: pick(['success','info','warning','danger']),
        user,
        text: pick([
          `فاکتور فروش <b>INV-${toFa(10240+i)}</b> را ثبت کرد`,
          `مشتری جدیدی به نام <b>${companyName()}</b> اضافه کرد`,
          `موجودی محصول <b>${pick(PRODUCT_NAMES).slice(0,30)}…</b> را به‌روزرسانی کرد`,
          `سفارش خرید <b>PO-${toFa(50210+i)}</b> را تأیید کرد`,
          `پرداخت فاکتور <b>INV-${toFa(10240+i)}</b> را ثبت کرد`,
          `محصول جدیدی به کاتالوگ اضافه کرد`,
          `انبار جدید <b>${pick(CITIES)}</b> را تعریف کرد`,
          `گزارش <b>گزارش فروش ماهانه</b> را تولید کرد`
        ]),
        time: pick([WORDS.justNow, WORDS.minsAgo(Math.floor(5+Math.random()*40)), WORDS.hoursAgo(Math.floor(1+Math.random()*6)), WORDS.daysAgo(Math.floor(1+Math.random()*5))])
      });
    }
    return arr;
  }

  /* ---------- Tasks ---------- */
  const TASKS = [
    { title:'تأیید سفارش خرید PO-۵۰۲۱۰', due:'امروز', priority:'high', done:false },
    { title:'بررسی موجودی کم انبار مرکزی', due:'امروز', priority:'high', done:false },
    { title:'تماس با تأمین‌کننده شیائومی', due:'فردا', priority:'med', done:false },
    { title:'صدور فاکتور مشتریان معوق', due:'۳ روز آینده', priority:'med', done:false },
    { title:'بستن صورت‌حساب پایان ماه', due:'این هفته', priority:'low', done:false },
    { title:'آماده‌سازی گزارش هیئت‌مدیره', due:'هفته آینده', priority:'low', done:true }
  ];

  /* ---------- KPIs (dashboard) ---------- */
  const KPIS = [
    { label:'درآمد امروز', value:'۸۴٫۲', suffix:'میلیون تومان', icon:'dollar', color:'success', trend:12.4, sub:'نسبت به دیروز' },
    { label:'فروش این ماه', value:'۲٫۴', suffix:'میلیارد تومان', icon:'trend-up', color:'primary', trend:8.1, sub:'نسبت به ماه قبل' },
    { label:'خرید این ماه', value:'۱٫۸', suffix:'میلیارد تومان', icon:'cart', color:'info', trend:-3.2, sub:'نسبت به ماه قبل' },
    { label:'مشتریان فعال', value:'۲٬۴۸۶', suffix:'نفر', icon:'users', color:'violet', trend:5.6, sub:'نسبت به ماه قبل' },
    { label:'تأمین‌کنندگان', value:'۱۴۸', suffix:'شرکت', icon:'truck', color:'warning', trend:2.1, sub:'نسبت به ماه قبل' },
    { label:'ارزش موجودی انبار', value:'۸٫۹', suffix:'میلیارد تومان', icon:'warehouse', color:'primary', trend:4.3, sub:'نسبت به ماه قبل' },
    { label:'هشدار موجودی کم', value:'۳۸', suffix:'کالا', icon:'alert', color:'danger', trend:-12, sub:'نسبت به هفته قبل' },
    { label:'فاکتورهای معوق', value:'۲۴', suffix:'فاکتور', icon:'file', color:'warning', trend:1.8, sub:'نسبت به هفته قبل' }
  ];

  /* ---------- Charts datasets ---------- */
  const CHART = {
    revenue: {
      labels: ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'],
      sales:  [1820, 2140, 1980, 2480, 2620, 2940, 2410, 2860, 3120, 3480, 3320, 2400],
      purchase:[1240, 1380, 1510, 1680, 1720, 1820, 1610, 1940, 2120, 2280, 2140, 1620]
    },
    weekly: {
      labels: ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'],
      data: [124, 168, 142, 196, 184, 212, 96]
    },
    categories: {
      labels: ['کالای دیجیتال','لوازم خانگی','پوشاک','مواد غذایی','آرایشی','سایر'],
      data: [42, 24, 14, 10, 6, 4]
    },
    payment: {
      labels: ['نقدی','کارت','اقساطی','چکی'],
      data: [48, 28, 14, 10]
    }
  };

  /* ---------- Warehouses ---------- */
  const WAREHOUSES = [
    { id:'W-01', name:'انبار مرکزی تهران', city:'تهران', manager:'میلاد رضایی', capacity:12000, used:8640, items:1240, value:4200000000, status:'active' },
    { id:'W-02', name:'انبار پردیس', city:'تهران', manager:'سارا محمدی', city:'تهران', capacity:6000, used:3120, items:680, value:1800000000, status:'active' },
    { id:'W-03', name:'انبار شیراز', city:'شیراز', manager:'علی کریمی', capacity:4500, used:2980, items:520, value:980000000, status:'active' },
    { id:'W-04', name:'انبار اصفهان', city:'اصفهان', manager:'نگار احمدی', capacity:4000, used:3840, items:410, value:760000000, status:'full' },
    { id:'W-05', name:'انبار مشهد', city:'مشهد', manager:'آرش نوری', capacity:3800, used:980, items:240, value:420000000, status:'low' },
    { id:'W-06', name:'انبار تبریز', city:'تبریز', manager:'پریسا جعفری', capacity:3000, used:0, items:0, value:0, status:'inactive' }
  ];

  /* ---------- Audit log ---------- */
  function buildAudit(n) {
    const actions = [
      ['ورود به سیستم', 'login', 'success'],
      ['ثبت فاکتور فروش', 'create', 'info'],
      ['ویرایش مشتری', 'edit', 'warning'],
      ['حذف محصول', 'delete', 'danger'],
      ['تغییر دسترسی کاربر', 'permission', 'warning'],
      ['صدور گزارش', 'export', 'info'],
      ['خروج از سیستم', 'logout', 'neutral']
    ];
    const rows = [];
    for (let i = 0; i < n; i++) {
      const a = pick(actions);
      rows.push({
        id: 70000 + i,
        user: fullName(),
        action: a[0],
        category: a[1],
        cls: a[2],
        ip: '۵٫۱۲۴.' + toFa(Math.floor(Math.random()*255)) + '.' + toFa(Math.floor(Math.random()*255)),
        module: pick(['فروش','انبار','مالی','خرید','تنظیمات','کاربران']),
        date: faDate('۱۴۰۳/۰' + toFa(1+(i%7)) + '/' + toFa(1+(i%28))) + ' ' + toFa(String(Math.floor(Math.random()*24)).padStart(2,'0')) + ':' + toFa(String(Math.floor(Math.random()*60)).padStart(2,'0'))
      });
    }
    return rows;
  }

  /* ---------- Public ---------- */
  global.NOVEXA = {
    toFa, faNum, faMoney, faDate, WORDS, initials,
    CATEGORIES, PRODUCT_BRANDS, DEVICE_BRANDS, DEVICE_MODELS, UNITS, WAREHOUSES,
    NOTIFS, TASKS, KPIS, CHART, ROLES, PO_STATUSES, SALE_STATUSES, TX_TYPES,
    fullName, companyName, phone, tel, initials, pick,
    products: buildProducts(48),
    customers: buildCustomers(36),
    suppliers: buildSuppliers(24),
    purchaseOrders: buildPurchaseOrders(28),
    sales: buildSales(40),
    inventoryTx: buildInventoryTx(32),
    users: buildUsers(20),
    activities: buildActivities(10),
    audit: buildAudit(24)
  };
})(window);
