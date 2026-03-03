import React from 'react'

interface OrderCancelledEmailProps {
    order_id: number
    user_email: string
    reason?: string
    date?: string
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

export const OrderCancelledEmail: React.FC<OrderCancelledEmailProps> = ({
    order_id,
    user_email,
    reason,
    date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    name,
    phone,
    address,
    orders = [],
    cost,
}) => {
    return (
        <div style={{
            backgroundColor: '#FEFBF5',
            fontFamily: '"Playfair Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
            padding: '40px 0',
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                margin: '0 auto',
                padding: '0',
                maxWidth: '600px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid #FFF7ED',
            }}>
                {/* Header */}
                <div style={{
                    backgroundColor: '#FFF7ED',
                    padding: '40px 0',
                    textAlign: 'center',
                    borderBottom: '2px solid #D97706',
                }}>
                    {/* Logo */}
                    <img
                        src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
                        alt="Mahek Provisions"
                        style={{
                            width: '120px',
                            height: 'auto',
                            marginBottom: '15px',
                            display: 'inline-block',
                        }}
                    />
                    <h1 style={{
                        color: '#ef4444',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        margin: '0',
                        letterSpacing: '4px',
                        fontFamily: '"Cinzel", serif',
                        textTransform: 'uppercase',
                    }}>Order Cancelled</h1>
                    <p style={{
                        color: '#D97706',
                        fontSize: '12px',
                        letterSpacing: '2px',
                        marginTop: '8px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        margin: 0
                    }}>Action Required</p>
                </div>

                {/* Content */}
                <div style={{ padding: '40px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        color: '#2D1B1B',
                        margin: '0 0 20px',
                        fontWeight: 'bold',
                    }}>Admin Notification</h2>
                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#4A3737',
                        margin: '0 0 20px',
                    }}>
                        An order has been cancelled by the user. Please update your records accordingly.
                    </p>

                    <div style={{
                        backgroundColor: '#FEFBF5',
                        padding: '20px',
                        borderRadius: '8px',
                        margin: '30px 0',
                        border: '1px solid #FED7AA',
                    }}>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{
                                fontSize: '12px',
                                color: '#D97706',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: 'bold',
                                margin: '0 0 5px',
                            }}>Order ID</p>
                            <p style={{
                                fontSize: '16px',
                                color: '#2D1B1B',
                                fontWeight: 'bold',
                                margin: '0',
                            }}>#{order_id}</p>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{
                                fontSize: '12px',
                                color: '#D97706',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: 'bold',
                                margin: '0 0 5px',
                            }}>Customer Email</p>
                            <p style={{
                                fontSize: '16px',
                                color: '#2D1B1B',
                                fontWeight: 'bold',
                                margin: '0',
                            }}>{user_email}</p>
                        </div>
                        {reason && (
                            <div>
                                <p style={{
                                    fontSize: '12px',
                                    color: '#D97706',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 'bold',
                                    margin: '0 0 5px',
                                }}>Cancellation Reason</p>
                                <p style={{
                                    fontSize: '16px',
                                    color: '#2D1B1B',
                                    fontWeight: 'bold',
                                    margin: '0',
                                }}>{reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Customer Details */}
                    {(name || phone || address) && (
                        <div style={{
                            backgroundColor: '#f9fafb',
                            padding: '20px',
                            borderRadius: '8px',
                            margin: '20px 0',
                            border: '1px solid #e5e7eb',
                        }}>
                            <h3 style={{
                                fontSize: '14px',
                                color: '#6b7280',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                margin: '0 0 15px',
                                fontWeight: 'bold',
                            }}>Customer Details</h3>
                            {name && (
                                <p style={{
                                    fontSize: '14px',
                                    color: '#2D1B1B',
                                    margin: '0 0 8px',
                                    lineHeight: '1.5',
                                }}>
                                    <strong>Name:</strong> {name}
                                </p>
                            )}
                            {phone && (
                                <p style={{
                                    fontSize: '14px',
                                    color: '#2D1B1B',
                                    margin: '0 0 8px',
                                    lineHeight: '1.5',
                                }}>
                                    <strong>Phone:</strong> {phone}
                                </p>
                            )}
                            {address && (
                                <p style={{
                                    fontSize: '14px',
                                    color: '#2D1B1B',
                                    margin: '0',
                                    lineHeight: '1.5',
                                }}>
                                    <strong>Address:</strong> {address}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Order Items */}
                    {orders && orders.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h3 style={{
                                fontSize: '18px',
                                color: '#2D1B1B',
                                margin: '0 0 20px',
                                fontWeight: 'bold',
                                borderBottom: '2px solid #D97706',
                                paddingBottom: '5px',
                                display: 'inline-block',
                            }}>Cancelled Items</h3>

                            {orders.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '15px 0',
                                    borderBottom: index < orders.length - 1 ? '1px solid #f3f4f6' : 'none',
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#2D1B1B',
                                            margin: '0 0 4px',
                                            fontWeight: 'bold',
                                        }}>{item.name}</p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            margin: '0',
                                        }}>Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#2D1B1B',
                                        fontWeight: 'bold',
                                    }}>₹{item.price * item.quantity}</div>
                                </div>
                            ))}

                            {cost && (
                                <div style={{
                                    marginTop: '20px',
                                    paddingTop: '20px',
                                    borderTop: '2px solid #2D1B1B',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <span style={{
                                            fontSize: '16px',
                                            color: '#2D1B1B',
                                            fontWeight: 'bold',
                                        }}>Total</span>
                                        <span style={{
                                            fontSize: '20px',
                                            color: '#dc2626',
                                            fontWeight: 'bold',
                                            fontFamily: '"Cinzel", serif',
                                        }}>₹{cost.total}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <p style={{
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#666666',
                        margin: '20px 0 0',
                        fontStyle: 'italic'
                    }}>
                        Note: This order was manually cancelled by the user from their profile/dashboard.
                    </p>
                </div>

                {/* Footer */}
                <div style={{
                    backgroundColor: '#2D1B1B',
                    padding: '30px',
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontSize: '12px',
                        color: '#9CA3AF',
                        lineHeight: '1.5',
                        margin: '0 0 10px',
                    }}>
                        &copy; {new Date().getFullYear()} Mahek Provisions. All rights reserved.
                    </p>
                    <p style={{
                        fontSize: '12px',
                        color: '#9CA3AF',
                        lineHeight: '1.5',
                        margin: '0',
                    }}>
                        System Notification • Mahek Provisions Admin
                    </p>
                </div>
            </div>
        </div>
    )
}
