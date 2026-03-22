const ProductCardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-image skeleton-pulse" />
        <div className="skeleton-body">
            <div className="skeleton-line skeleton-pulse" style={{ width: "60%" }} />
            <div className="skeleton-line skeleton-pulse" style={{ width: "80%" }} />
            <div className="skeleton-line skeleton-pulse short" style={{ width: "40%" }} />
        </div>
    </div>
);

const ProductGridSkeleton = ({ count = 16 }) => (
    <div className="products-grid">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

export { ProductCardSkeleton, ProductGridSkeleton };
