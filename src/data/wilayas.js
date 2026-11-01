/**
 * Algeria's 69 wilayas (code, English name in the common French-based
 * transliteration, official Arabic name). Editable data; the site shows the
 * English names only.
 *
 * Sources (re-checked 2026-10-22):
 * - 01–48: the 1984 division; 49–58: Law 19-12 (2019). Long-standing codes.
 * - 59–69: Law 26-06 of 4 April 2026 (Official Gazette no. 25, 5 April 2026)
 *   sets 69 wilayas and creates these eleven in its articles 52 bis 10 to
 *   52 bis 20, in this order. Latin names follow the French text of the law
 *   (transcribed in github.com/islam-re/Algeria-wilayas, "JO Article 2026");
 *   the codes 59–69 in this order also appear in the French Wikipedia list of
 *   wilayas and in Lexis Middle East news (2026-06-06).
 * - Not verified against an official text: the instrument that assigns the
 *   numbers 59–69 (sources disagree on its reference, so none is cited) and
 *   the Arabic names of 59–69 (one source only, the dataset above).
 *
 * @typedef {{ code: string, name: string, nameAr: string }} Wilaya
 */

/** @type {Wilaya[]} */
export const wilayas = [
  { code: '01', name: 'Adrar', nameAr: 'أدرار' },
  { code: '02', name: 'Chlef', nameAr: 'الشلف' },
  { code: '03', name: 'Laghouat', nameAr: 'الأغواط' },
  { code: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي' },
  { code: '05', name: 'Batna', nameAr: 'باتنة' },
  { code: '06', name: 'Béjaïa', nameAr: 'بجاية' },
  { code: '07', name: 'Biskra', nameAr: 'بسكرة' },
  { code: '08', name: 'Béchar', nameAr: 'بشار' },
  { code: '09', name: 'Blida', nameAr: 'البليدة' },
  { code: '10', name: 'Bouira', nameAr: 'البويرة' },
  { code: '11', name: 'Tamanrasset', nameAr: 'تمنراست' },
  { code: '12', name: 'Tébessa', nameAr: 'تبسة' },
  { code: '13', name: 'Tlemcen', nameAr: 'تلمسان' },
  { code: '14', name: 'Tiaret', nameAr: 'تيارت' },
  { code: '15', name: 'Tizi Ouzou', nameAr: 'تيزي وزو' },
  { code: '16', name: 'Algiers', nameAr: 'الجزائر' },
  { code: '17', name: 'Djelfa', nameAr: 'الجلفة' },
  { code: '18', name: 'Jijel', nameAr: 'جيجل' },
  { code: '19', name: 'Sétif', nameAr: 'سطيف' },
  { code: '20', name: 'Saïda', nameAr: 'سعيدة' },
  { code: '21', name: 'Skikda', nameAr: 'سكيكدة' },
  { code: '22', name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس' },
  { code: '23', name: 'Annaba', nameAr: 'عنابة' },
  { code: '24', name: 'Guelma', nameAr: 'قالمة' },
  { code: '25', name: 'Constantine', nameAr: 'قسنطينة' },
  { code: '26', name: 'Médéa', nameAr: 'المدية' },
  { code: '27', name: 'Mostaganem', nameAr: 'مستغانم' },
  { code: '28', name: "M'Sila", nameAr: 'المسيلة' },
  { code: '29', name: 'Mascara', nameAr: 'معسكر' },
  { code: '30', name: 'Ouargla', nameAr: 'ورقلة' },
  { code: '31', name: 'Oran', nameAr: 'وهران' },
  { code: '32', name: 'El Bayadh', nameAr: 'البيض' },
  { code: '33', name: 'Illizi', nameAr: 'إليزي' },
  { code: '34', name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج' },
  { code: '35', name: 'Boumerdès', nameAr: 'بومرداس' },
  { code: '36', name: 'El Tarf', nameAr: 'الطارف' },
  { code: '37', name: 'Tindouf', nameAr: 'تندوف' },
  { code: '38', name: 'Tissemsilt', nameAr: 'تيسمسيلت' },
  { code: '39', name: 'El Oued', nameAr: 'الوادي' },
  { code: '40', name: 'Khenchela', nameAr: 'خنشلة' },
  { code: '41', name: 'Souk Ahras', nameAr: 'سوق أهراس' },
  { code: '42', name: 'Tipaza', nameAr: 'تيبازة' },
  { code: '43', name: 'Mila', nameAr: 'ميلة' },
  { code: '44', name: 'Aïn Defla', nameAr: 'عين الدفلى' },
  { code: '45', name: 'Naâma', nameAr: 'النعامة' },
  { code: '46', name: 'Aïn Témouchent', nameAr: 'عين تموشنت' },
  { code: '47', name: 'Ghardaïa', nameAr: 'غرداية' },
  { code: '48', name: 'Relizane', nameAr: 'غليزان' },
  { code: '49', name: 'Timimoun', nameAr: 'تيميمون' },
  { code: '50', name: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار' },
  { code: '51', name: 'Ouled Djellal', nameAr: 'أولاد جلال' },
  { code: '52', name: 'Béni Abbès', nameAr: 'بني عباس' },
  { code: '53', name: 'In Salah', nameAr: 'عين صالح' },
  { code: '54', name: 'In Guezzam', nameAr: 'عين قزام' },
  { code: '55', name: 'Touggourt', nameAr: 'تقرت' },
  { code: '56', name: 'Djanet', nameAr: 'جانت' },
  { code: '57', name: "El M'Ghair", nameAr: 'المغير' },
  { code: '58', name: 'El Meniaa', nameAr: 'المنيعة' },
  { code: '59', name: 'Aflou', nameAr: 'أفلو' },
  { code: '60', name: 'Barika', nameAr: 'بريكة' },
  { code: '61', name: 'El Kantara', nameAr: 'القنطرة' },
  { code: '62', name: 'Bir El Ater', nameAr: 'بئر العاتر' },
  { code: '63', name: 'El Aricha', nameAr: 'العريشة' },
  { code: '64', name: 'Ksar Chellala', nameAr: 'قصر الشلالة' },
  { code: '65', name: 'Aïn Ouessara', nameAr: 'عين وسارة' },
  { code: '66', name: 'Messaad', nameAr: 'مسعد' },
  { code: '67', name: 'Ksar El Boukhari', nameAr: 'قصر البخاري' },
  { code: '68', name: 'Bou Saada', nameAr: 'بوسعادة' },
  { code: '69', name: 'El Abiodh Sidi Cheikh', nameAr: 'الأبيض سيدي الشيخ' },
];
