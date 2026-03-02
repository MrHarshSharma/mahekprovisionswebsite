import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Create empty template with sample rows
        const templateData = [
            {
                'ID': '',
                'Product Name': 'Example Simple Product',
                'Description': 'Main product description here',
                'Details': 'Product specifications and details',
                'Care Instructions': 'Storage and care instructions',
                'Price': '500',
                'Categories': 'Gourmet, Hampers',
                'Type': 'simple',
                'Variation Names': '',
                'Variation Prices': '',
                'Image URLs': 'https://example.com/image1.jpg, https://example.com/image2.jpg',
            },
            {
                'ID': '',
                'Product Name': 'Example Variable Product',
                'Description': 'A product with multiple sizes',
                'Details': 'Premium quality product details',
                'Care Instructions': 'Keep in cool dry place',
                'Price': '',
                'Categories': 'Dry Fruits',
                'Type': 'variable',
                'Variation Names': '250g, 500g, 1kg',
                'Variation Prices': '350, 650, 1200',
                'Image URLs': 'https://example.com/image.jpg',
            }
        ]

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(templateData)

        // Set column widths
        const columnWidths = [
            { wch: 10 },  // ID
            { wch: 40 },  // Product Name
            { wch: 50 },  // Description
            { wch: 40 },  // Details
            { wch: 30 },  // Care Instructions
            { wch: 12 },  // Price
            { wch: 25 },  // Categories
            { wch: 12 },  // Type
            { wch: 25 },  // Variation Names
            { wch: 20 },  // Variation Prices
            { wch: 80 },  // Image URLs
        ]
        worksheet['!cols'] = columnWidths

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

        // Return Excel file
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="products_template.xlsx"`,
            },
        })

    } catch (error) {
        console.error('Template generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate template', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
