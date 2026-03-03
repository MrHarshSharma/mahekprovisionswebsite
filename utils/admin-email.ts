import { OrderCancelledEmail } from '@/components/email/order-cancelled'
import React from 'react'

export interface CancelEmailData {
    order_id: number
    user_email: string
    reason?: string
    name?: string
    phone?: string
    address?: string
    orders?: Array<{
        name: string
        price: number
        quantity: number
        image?: string
    }>
    cost?: {
        total: number
    }
}

export async function sendOrderCancellationEmail(data: CancelEmailData): Promise<boolean> {
    try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

        if (!serviceId || !templateId || !publicKey) {
            console.error('EmailJS credentials not configured')
            return false
        }

        // Dynamic import for server-side rendering
        const { renderToStaticMarkup } = await import('react-dom/server')

        const messageHtml = renderToStaticMarkup(
            React.createElement(OrderCancelledEmail, {
                order_id: data.order_id,
                user_email: data.user_email,
                reason: data.reason,
                name: data.name,
                phone: data.phone,
                address: data.address,
                orders: data.orders,
                cost: data.cost
            })
        )

        const templateParams = {
            name: 'Admin',
            to_email: (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',')[0],
            order_id: data.order_id,
            message_html: messageHtml,
            subject: `Order #${data.order_id} Cancelled by User - Mahek Provisions`,
            from_name: 'Mahek Provisions',
            reply_to: process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
        }

        console.log('Sending Admin Cancellation Email for Order:', data.order_id)

        // Use REST API for server-side (emailjs/browser doesn't work on server)
        const privateKey = process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,
                accessToken: privateKey, // Required for server-side calls
                template_params: templateParams,
            }),
        })

        if (!response.ok) {
            const text = await response.text()
            console.error('EmailJS API Error:', text)
            return false
        }

        console.log('Order cancellation email sent successfully to admin')
        return true
    } catch (error) {
        console.error('Failed to send order cancellation email:', error)
        return false
    }
}
