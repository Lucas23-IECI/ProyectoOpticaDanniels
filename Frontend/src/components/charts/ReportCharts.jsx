import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell,
    AreaChart, Area,
    ComposedChart, Line,
    ResponsiveContainer,
} from 'recharts';

const COLORS = [
    '#2147A2', '#29A937', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#3498db', '#2ecc71', '#e91e63',
];

const commonProps = {
    style: { fontSize: '12px' },
};

// ─── Pie Chart ────────────────────────────────────────

export const SimplePieChart = ({ data, nameKey, valueKey, height = 280 }) => {
    if (!data || data.length === 0) return <p className="no-data">Sin datos</p>;

    const RADIAN = Math.PI / 180;
    const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        if (percent < 0.05) return null;
        return (
            <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey={valueKey}
                    nameKey={nameKey}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    labelLine={false}
                    label={renderLabel}
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [value, '']} />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

// ─── Horizontal Bar Chart ─────────────────────────────

export const HorizontalBarChart = ({ data, nameKey, valueKey, height, barColor = '#2147A2' }) => {
    if (!data || data.length === 0) return <p className="no-data">Sin datos</p>;

    const chartHeight = height || Math.max(220, data.length * 38);

    return (
        <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" {...commonProps} />
                <YAxis dataKey={nameKey} type="category" width={100} {...commonProps} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey={valueKey} fill={barColor} radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
        </ResponsiveContainer>
    );
};

// ─── Area / Line Chart for trends ─────────────────────

export const TrendAreaChart = ({ data, nameKey, valueKey, height = 280, color = '#2147A2' }) => {
    if (!data || data.length === 0) return <p className="no-data">Sin datos</p>;

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`gradient-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey={nameKey} {...commonProps} />
                <YAxis {...commonProps} />
                <Tooltip />
                <Area type="monotone" dataKey={valueKey} stroke={color} strokeWidth={2.5} fill={`url(#gradient-${valueKey})`} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

// ─── Composed Chart (bars + line, dual data) ──────────

export const OrdersTrendChart = ({ data, height = 300 }) => {
    if (!data || data.length === 0) return <p className="no-data">Sin datos</p>;

    const formatCurrency = (v) => `$${Number(v || 0).toLocaleString('es-CL')}`;

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="label" {...commonProps} />
                <YAxis yAxisId="left" {...commonProps} />
                <YAxis yAxisId="right" orientation="right" {...commonProps} tickFormatter={formatCurrency} />
                <Tooltip formatter={(value, name) => {
                    if (name === 'ingresos') return [formatCurrency(value), 'Ingresos'];
                    return [value, 'Órdenes'];
                }} />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Bar yAxisId="left" dataKey="cantidad" name="Órdenes" fill="#2147A2" radius={[4, 4, 0, 0]} barSize={28} />
                <Line yAxisId="right" type="monotone" dataKey="ingresos" name="Ingresos" stroke="#29A937" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

// ─── Bar Chart with custom colors per bar ─────────────

export const StatusBarChart = ({ data, nameKey, valueKey, colorMap, height }) => {
    if (!data || data.length === 0) return <p className="no-data">Sin datos</p>;

    const chartHeight = height || Math.max(220, data.length * 45);

    return (
        <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" {...commonProps} />
                <YAxis dataKey={nameKey} type="category" width={100} {...commonProps} />
                <Tooltip />
                <Bar dataKey={valueKey} radius={[0, 6, 6, 0]} barSize={22}>
                    {data.map((entry, i) => (
                        <Cell key={i} fill={(colorMap && colorMap[entry[nameKey]]) || COLORS[i % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
