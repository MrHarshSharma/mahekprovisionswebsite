import { NextResponse } from 'next/server'
import { deleteImage } from '@/utils/image-upload'

export async function POST(request: Request) {
    try {
        const { urls } = await request.json()

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json(
                { error: 'No image URLs provided' },
                { status: 400 }
            )
        }

        const results: { url: string; success: boolean; error?: string }[] = []

        for (const url of urls) {
            try {
                await deleteImage(url)
                results.push({ url, success: true })
            } catch (error) {
                console.error(`Failed to delete image ${url}:`, error)
                results.push({
                    url,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }

        const successCount = results.filter(r => r.success).length
        const failedCount = results.filter(r => !r.success).length

        return NextResponse.json({
            success: true,
            message: `Deleted ${successCount} image(s)${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
            results
        })

    } catch (error) {
        console.error('Delete images error:', error)
        return NextResponse.json(
            {
                error: 'Failed to delete images',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
