import React from 'react';

function QualityInspection() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', gap: '1rem', height: '100%' }}>
            {/* 左侧：项目基本信息 */}
            <div style={{ flex: 1, backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
                <h2>项目基本信息</h2>
                <div>
                    <p><strong>项目名称：</strong></p>
                    <p><strong>负责人：</strong></p>
                    <p><strong>工期：</strong></p>
                    <p><strong>订单号：</strong></p>
                    <p><strong>零件数量：</strong></p>
                </div>
            </div>

            {/* 中间：图片区域 */}
            <div style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                <img
                    src="https://via.placeholder.com/400x300" // 占位图片，后续替换为指定图片
                    alt="质量检测图片"
                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
            </div>

            {/* 右侧：质量检测信息 */}
            <div style={{ flex: 1, backgroundColor: '#fafafa', padding: '1rem', borderRadius: '8px' }}>
                <h2>质量检测信息</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }}>
                        <p><strong>检测项 1：</strong>外观检查</p>
                        <p><strong>结果：</strong>合格</p>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }}>
                        <p><strong>检测项 2：</strong>尺寸测量</p>
                        <p><strong>结果：</strong>合格</p>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px' }}>
                        <p><strong>检测项 3：</strong>功能测试</p>
                        <p><strong>结果：</strong>合格</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QualityInspection;