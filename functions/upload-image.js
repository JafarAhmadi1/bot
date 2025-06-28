// functions/upload-image.js

/**
 * این تابع داده تصویر را از فرانت‌اند دریافت کرده،
 * آن را به API سرویس imgbb ارسال می‌کند و URL عمومی تصویر را برمی‌گرداند.
 */
export async function onRequestPost(context) {
    try {
        // 1. دریافت داده از بدنه درخواست
        const { imageData } = await context.request.json();
        if (!imageData || !imageData.startsWith('data:image/png;base64,')) {
            return new Response(JSON.stringify({ error: 'داده تصویر نامعتبر است.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
            });
        }

        // 2. قرار دادن مستقیم کلید API برای تست
        // هشدار: این روش ناامن است. پس از تست موفق، آن را با متغیر محیطی جایگزین کنید.
        const apiKey = "37d5e60ceda885439b1bdcbab0ee0e00";

        // 3. جدا کردن بخش Base64 از داده تصویر
        const base64Data = imageData.split(',')[1];

        // 4. ساخت بدنه درخواست به صورت FormData
        const formData = new FormData();
        formData.append('image', base64Data);
        
        // 5. ارسال درخواست به API سایت imgbb
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        // 6. بررسی موفقیت‌آمیز بودن پاسخ
        if (!result.success) {
            console.error('imgbb API Error:', result.error?.message);
            throw new Error('سرویس آپلود تصویر با خطا مواجه شد.');
        }

        // 7. بازگرداندن URL تصویر از پاسخ imgbb
        const publicUrl = result.data.url;

        return new Response(JSON.stringify({ url: publicUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });

    } catch (error) {
        console.error('Error in upload function:', error.message);
        return new Response(JSON.stringify({ error: error.message || 'خطای داخلی سرور.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
    }
}
