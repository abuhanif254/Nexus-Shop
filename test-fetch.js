const data = {
    store_id: 'nexus6a39eba39cefb',
    store_passwd: 'nexus6a39eba39cefb@ssl',
    total_amount: 100 * 115,
    currency: 'BDT',
    tran_id: '12345',
    success_url: `http://localhost:3000/api/webhooks/sslcommerz?status=success&orderId=12345`,
    fail_url: `http://localhost:3000/api/webhooks/sslcommerz?status=fail&orderId=12345`,
    cancel_url: `http://localhost:3000/api/webhooks/sslcommerz?status=cancel&orderId=12345`,
    ipn_url: `http://localhost:3000/api/webhooks/sslcommerz?status=ipn`,
    shipping_method: 'Courier',
    product_name: 'Nexus Shop Items',
    product_category: 'Ecommerce',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'customer@example.com',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: '1000',
    ship_country: 'Bangladesh',
};

const formData = new URLSearchParams();
for (const key in data) {
    formData.append(key, data[key]);
}

fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
})
.then(res => res.json())
.then(result => {
    console.log("FETCH RESULT:", result);
})
.catch(err => {
    console.error("FETCH ERROR:", err);
});
