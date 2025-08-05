import { useState, useEffect, useRef } from 'react';
import { FaCalendar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '@styles/datePicker.css';

const DatePicker = ({ value, onChange, placeholder = "Seleccionar fecha", disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
    const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'
    const pickerRef = useRef(null);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
                setViewMode('days');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value) {
            setSelectedDate(new Date(value));
            setCurrentDate(new Date(value));
        }
    }, [value]);

    const formatDate = (date) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        const days = [];
        
        // Días del mes anterior
        for (let i = 0; i < firstDayOfMonth; i++) {
            const prevMonth = new Date(year, month - 1, 0);
            const day = prevMonth.getDate() - firstDayOfMonth + i + 1;
            days.push({
                date: new Date(year, month - 1, day),
                isCurrentMonth: false,
                isToday: false,
                isSelected: false
            });
        }
        
        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push({
                date,
                isCurrentMonth: true,
                isToday: isToday(date),
                isSelected: selectedDate && isSameDay(date, selectedDate)
            });
        }
        
        // Días del mes siguiente
        const remainingDays = 42 - days.length; // 6 semanas * 7 días
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({
                date,
                isCurrentMonth: false,
                isToday: false,
                isSelected: false
            });
        }
        
        return days;
    };

    const isToday = (date) => {
        const today = new Date();
        return isSameDay(date, today);
    };

    const isSameDay = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setCurrentDate(date);
        onChange(formatDate(date));
        setIsOpen(false);
        setViewMode('days');
    };

    const handleMonthSelect = (monthIndex) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
        setViewMode('days');
    };

    const handleYearSelect = (year) => {
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
        setViewMode('days');
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        if (viewMode === 'days') {
            newDate.setMonth(newDate.getMonth() + direction);
        } else if (viewMode === 'months') {
            newDate.setFullYear(newDate.getFullYear() + direction);
        } else if (viewMode === 'years') {
            newDate.setFullYear(newDate.getFullYear() + (direction * 10));
        }
        setCurrentDate(newDate);
    };

    const getYearRange = () => {
        const currentYear = currentDate.getFullYear();
        const startYear = Math.floor(currentYear / 10) * 10;
        const years = [];
        for (let i = startYear - 10; i <= startYear + 9; i++) {
            years.push(i);
        }
        return years;
    };

    const renderDays = () => {
        const days = getDaysInMonth(currentDate);
        
        return (
            <div className="date-picker-calendar">
                <div className="date-picker-header">
                    <button 
                        type="button"
                        onClick={() => navigateMonth(-1)}
                        className="date-picker-nav-btn"
                    >
                        <FaChevronLeft />
                    </button>
                    <div className="date-picker-title">
                        <button 
                            type="button"
                            onClick={() => setViewMode('months')}
                            className="date-picker-title-btn"
                        >
                            {months[currentDate.getMonth()]}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setViewMode('years')}
                            className="date-picker-title-btn"
                        >
                            {currentDate.getFullYear()}
                        </button>
                    </div>
                    <button 
                        type="button"
                        onClick={() => navigateMonth(1)}
                        className="date-picker-nav-btn"
                    >
                        <FaChevronRight />
                    </button>
                </div>
                
                <div className="date-picker-weekdays">
                    {weekDays.map(day => (
                        <div key={day} className="date-picker-weekday">{day}</div>
                    ))}
                </div>
                
                <div className="date-picker-days">
                    {days.map((day, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleDateSelect(day.date)}
                            className={`date-picker-day ${
                                !day.isCurrentMonth ? 'other-month' : ''
                            } ${day.isToday ? 'today' : ''} ${
                                day.isSelected ? 'selected' : ''
                            }`}
                            disabled={!day.isCurrentMonth}
                        >
                            {day.date.getDate()}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderMonths = () => {
        return (
            <div className="date-picker-calendar">
                <div className="date-picker-header">
                    <button 
                        type="button"
                        onClick={() => navigateMonth(-1)}
                        className="date-picker-nav-btn"
                    >
                        <FaChevronLeft />
                    </button>
                    <button 
                        type="button"
                        onClick={() => setViewMode('years')}
                        className="date-picker-title-btn"
                    >
                        {currentDate.getFullYear()}
                    </button>
                    <button 
                        type="button"
                        onClick={() => navigateMonth(1)}
                        className="date-picker-nav-btn"
                    >
                        <FaChevronRight />
                    </button>
                </div>
                
                <div className="date-picker-months">
                    {months.map((month, index) => (
                        <button
                            key={month}
                            type="button"
                            onClick={() => handleMonthSelect(index)}
                            className={`date-picker-month ${
                                index === currentDate.getMonth() ? 'selected' : ''
                            }`}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderYears = () => {
        const years = getYearRange();
        
        return (
            <div className="date-picker-calendar">
                <div className="date-picker-header">
                    <button 
                        type="button"
                        onClick={() => navigateMonth(-1)}
                        className="date-picker-nav-btn"
                    >
                        <FaChevronLeft />
                    </button>
                    <div className="date-picker-title">
                        {Math.floor(currentDate.getFullYear() / 10) * 10 - 10} - {Math.floor(currentDate.getFullYear() / 10) * 10 + 9}
                    </div>
                    <button 
                        type="button"
                        onClick={() => navigateMonth(1)}
                        className="date-picker-nav-btn"
                    >
                        <FaChevronRight />
                    </button>
                </div>
                
                <div className="date-picker-years">
                    {years.map(year => (
                        <button
                            key={year}
                            type="button"
                            onClick={() => handleYearSelect(year)}
                            className={`date-picker-year ${
                                year === currentDate.getFullYear() ? 'selected' : ''
                            }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="date-picker-container" ref={pickerRef}>
            <div className="date-picker-input-container">
                <input
                    type="text"
                    value={formatDate(selectedDate)}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="date-picker-input"
                    readOnly
                />
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="date-picker-toggle"
                >
                    <FaCalendar />
                </button>
            </div>
            
            {isOpen && (
                <div className="date-picker-dropdown">
                    {viewMode === 'days' && renderDays()}
                    {viewMode === 'months' && renderMonths()}
                    {viewMode === 'years' && renderYears()}
                </div>
            )}
        </div>
    );
};

export default DatePicker; 