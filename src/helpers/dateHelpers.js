// src/helpers/dateHelpers.js

/**
 * تحويل Date Object أو ISO string إلى YYYY-MM-DD (local timezone)
 * يستخدم في <input type="date" />
 */
export const toDateInputValue = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // التأكد من صحة التاريخ
  if (isNaN(d.getTime())) return '';
  
  // استخراج السنة والشهر واليوم من التوقيت المحلي
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * تحويل YYYY-MM-DD إلى ISO string مع UTC midnight
 * يستخدم عند الإرسال للـ Backend
 */
export const toUTCMidnight = (dateString) => {
  if (!dateString) return null;
  
  const [year, month, day] = dateString.split('-').map(Number);
  
  // إنشاء Date بـ UTC midnight
  const d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
   console.log('toUTCMidnight result:', d.toISOString());
  return d.toISOString();
};

/**
 * عرض التاريخ بصيغة قابلة للقراءة (حسب locale المستخدم)
 */
export const formatDisplayDate = (date, locale = 'en-GB') => {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * حساب عدد الأيام بين تاريخين (شامل)
 */
export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // +1 لأن اليوم الأول محسوب
};

/**
 * التحقق من صحة نطاق التواريخ
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate) return false;
  if (!endDate) return true; // endDate اختياري
  
  return endDate >= startDate;
};

/**
 * الحصول على التاريخ الحالي بصيغة YYYY-MM-DD
 */
export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};