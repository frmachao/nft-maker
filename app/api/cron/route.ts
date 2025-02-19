import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    // 验证 cron 请求
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 简单查询总数，保持数据库连接活跃
        const count = await prisma.nFTMint.count();
        
        return NextResponse.json({ 
            success: true, 
            message: 'Database pinged successfully',
            count 
        });
    } catch (error) {
        console.error('Cron job failed:', error);
        return NextResponse.json(
            { error: 'Failed to ping database' }, 
            { status: 500 }
        );
    }
}