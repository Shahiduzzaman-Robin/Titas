import React from 'react';
import Select from 'react-select';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'white',
        borderColor: state.isFocused ? '#cbd5e1' : '#e2e8f0',
        borderRadius: '20px', // More rounded like screenshot
        padding: state.selectProps.Icon ? '0.15rem 0.5rem 0.15rem 2.8rem' : '0.15rem 0.8rem',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#cbd5e1'
        },
        fontFamily: 'var(--font-bangla)',
        fontSize: '0.95rem',
        minHeight: '44px',
        borderStyle: 'solid',
        borderWidth: '1px'
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f8fafc' : 'white',
        color: state.isSelected ? '#1e40af' : '#1f2937',
        cursor: 'pointer',
        fontFamily: 'var(--font-bangla)',
        padding: '10px 16px',
        '&:active': {
            backgroundColor: '#e0f2fe'
        }
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
        zIndex: 100,
        marginTop: '4px'
    }),
    menuList: (provided) => ({
        ...provided,
        padding: '4px'
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#94a3b8'
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#1f2937'
    }),
    input: (provided) => ({
        ...provided,
        color: '#1f2937',
        fontFamily: 'var(--font-bangla)'
    }),
    indicatorSeparator: () => ({
        display: 'none'
    })
};

const CustomSelect = ({ options, value, onChange, name, placeholder, required, className, Icon }) => {
    // Determine the currently selected object based on value
    const selectedOption = options.find(option => option.value === value) || null;

    const handleChange = (selectedOption) => {
        // Mock the event object so we don't break existing handlers
        const event = {
            target: {
                name,
                value: selectedOption ? selectedOption.value : ''
            }
        };
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <div className="custom-select-wrapper" style={{ position: 'relative' }}>
            {Icon && (
                <div className="select-icon-prefix" style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 5,
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none'
                }}>
                    <Icon size={18} strokeWidth={1.5} />
                </div>
            )}
            <Select
                name={name}
                options={options}
                value={selectedOption}
                onChange={handleChange}
                placeholder={placeholder || 'নির্বাচন করুন'}
                isClearable={!required}
                isSearchable={true}
                styles={customStyles}
                className={className}
                classNamePrefix="react-select"
                noOptionsMessage={() => 'পাওয়া যায়নি'}
                Icon={Icon} // Pass to styles
            />
        </div>
    );
};

export default CustomSelect;
