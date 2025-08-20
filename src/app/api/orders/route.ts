import { NextRequest, NextResponse } from 'next/server';
import { sendOrderToTelegram } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const { customer, items, totalPrice, orderNumber, preferredContact } = await request.json();

    // Подготавливаем данные для Telegram
    const orderData = {
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: customer.address,
      preferredContact: preferredContact,
      items: items,
      totalPrice: totalPrice,
      orderNumber: orderNumber,
    };

    // Отправляем в Telegram
    const telegramSent = await sendOrderToTelegram(orderData);

    if (telegramSent) {
      return NextResponse.json({ 
        success: true, 
        message: 'Заказ успешно отправлен',
        orderNumber 
      });
    } else {
      // Даже если Telegram не сработал, считаем заказ принятым
      console.error('Telegram не сработал, но заказ принят');
      return NextResponse.json({ 
        success: true, 
        message: 'Заказ принят, но уведомление не отправлено',
        orderNumber 
      });
    }
  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке заказа' },
      { status: 500 }
    );
  }
}
