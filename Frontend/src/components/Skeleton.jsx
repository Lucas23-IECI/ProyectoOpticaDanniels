import "@styles/skeleton.css";

export function SkeletonBox({ width, height, borderRadius, className = '' }) {
    return (
        <div
            className={`skeleton-box ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
}

export function SkeletonText({ lines = 3, className = '' }) {
    return (
        <div className={`skeleton-text ${className}`}>
            {Array.from({ length: lines }, (_, i) => (
                <div
                    key={i}
                    className="skeleton-line"
                    style={{ width: i === lines - 1 ? '60%' : '100%' }}
                />
            ))}
        </div>
    );
}

export function SkeletonProductCard() {
    return (
        <div className="skeleton-product-card">
            <SkeletonBox height="200px" borderRadius="var(--border-radius) var(--border-radius) 0 0" />
            <div className="skeleton-product-body">
                <SkeletonBox width="40%" height="14px" borderRadius="4px" />
                <SkeletonBox width="80%" height="18px" borderRadius="4px" />
                <SkeletonText lines={2} />
                <SkeletonBox width="30%" height="22px" borderRadius="4px" />
            </div>
        </div>
    );
}

export function SkeletonProductDetail() {
    return (
        <div className="skeleton-detail">
            <div className="skeleton-detail-grid">
                <SkeletonBox height="400px" borderRadius="var(--border-radius)" className="skeleton-detail-image" />
                <div className="skeleton-detail-info">
                    <SkeletonBox width="30%" height="14px" borderRadius="4px" />
                    <SkeletonBox width="70%" height="28px" borderRadius="4px" />
                    <SkeletonBox width="40%" height="16px" borderRadius="4px" />
                    <SkeletonBox width="25%" height="32px" borderRadius="4px" />
                    <SkeletonText lines={4} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <SkeletonBox width="140px" height="48px" borderRadius="var(--border-radius)" />
                        <SkeletonBox width="48px" height="48px" borderRadius="var(--border-radius)" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonProductGrid({ count = 4 }) {
    return (
        <div className="skeleton-product-grid">
            {Array.from({ length: count }, (_, i) => (
                <SkeletonProductCard key={i} />
            ))}
        </div>
    );
}
