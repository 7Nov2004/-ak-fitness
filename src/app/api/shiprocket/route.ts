import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderData } = body;

    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Shiprocket credentials are not configured in environment variables.' },
        { status: 500 }
      );
    }

    // Step 1: Authenticate with Shiprocket
    const authResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok || !authData.token) {
      console.error('Shiprocket Auth Error:', authData);
      return NextResponse.json({ error: 'Failed to authenticate with Shiprocket' }, { status: 401 });
    }

    const token = authData.token;

    // Step 2: Create Order in Shiprocket
    // Constructing order payload as per Shiprocket Custom Order API documentation
    const shiprocketOrder = {
      order_id: `AK-${Date.now()}`,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Primary", // Must match the pickup location name in Shiprocket dashboard
      billing_customer_name: orderData.firstName,
      billing_last_name: orderData.lastName,
      billing_address: orderData.streetAddress,
      billing_city: orderData.city,
      billing_pincode: orderData.zipCode,
      billing_state: "State", // You might want to add a state field in checkout later
      billing_country: "India",
      billing_email: orderData.email,
      billing_phone: "9999999999", // Replace with actual customer phone later
      shipping_is_billing: true,
      order_items: orderData.items.map((item: any) => ({
        name: item.name,
        sku: item.id || "SKU-1",
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: 4411
      })),
      payment_method: orderData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      sub_total: orderData.total,
      length: 10,
      breadth: 15,
      height: 20,
      weight: 1.5 // Approx weight in KG
    };

    const orderResponse = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(shiprocketOrder),
    });

    const orderResult = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error('Shiprocket Order Creation Error:', orderResult);
      return NextResponse.json({ error: 'Failed to push order to Shiprocket', details: orderResult }, { status: 400 });
    }

    return NextResponse.json({ success: true, shipment: orderResult });

  } catch (error: any) {
    console.error('Shiprocket API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
