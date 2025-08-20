const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  preferredContact?: {
    method: 'phone' | 'whatsapp' | 'telegram' | 'email';
    value: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalPrice: number;
  orderNumber: string;
}

export async function sendOrderToTelegram(orderData: OrderData) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID не настроены');
    return false;
  }

  const contactLabel = orderData.preferredContact
    ? orderData.preferredContact.method === 'phone'
      ? 'Телефон'
      : orderData.preferredContact.method === 'whatsapp'
      ? 'WhatsApp'
      : orderData.preferredContact.method === 'telegram'
      ? 'Telegram'
      : 'Email'
    : null;

  const lines: string[] = [];
  lines.push(`🛒 <b>Заказ #${orderData.orderNumber}</b>`);
  lines.push(
    [
      `👤 <b>${orderData.customerName}</b>`,
      orderData.customerPhone ? `📞 ${orderData.customerPhone}` : null,
      orderData.customerEmail ? `✉️ ${orderData.customerEmail}` : null,
      orderData.customerAddress ? `📍 ${orderData.customerAddress}` : null,
      contactLabel && orderData.preferredContact
        ? `💬 <b>${contactLabel}:</b> ${orderData.preferredContact.value}`
        : null,
    ]
      .filter(Boolean)
      .join(' • ')
  );
  lines.push('');
  lines.push('📦 <b>Товары:</b>');
  lines.push(
    orderData.items
      .map(
        (i) => `• ${i.name} ×${i.quantity} — ${(i.price * i.quantity).toLocaleString('ru-RU')} ₽`
      )
      .join('\n')
  );
  lines.push('');
  lines.push(`💰 <b>Итого:</b> ${orderData.totalPrice.toLocaleString('ru-RU')} ₽`);
  lines.push(`🕒 ${new Date().toLocaleString('ru-RU')}`);

  const message = lines.join('\n').trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('Заказ отправлен в Telegram');
      return true;
    } else {
      console.error('Ошибка отправки в Telegram:', result);
      return false;
    }
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error);
    return false;
  }
}
