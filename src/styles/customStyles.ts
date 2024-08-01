import { StylesConfig } from 'react-select';

export interface OptionType {
    value: string;
    label: string;
}

const customStyles: StylesConfig<OptionType, true> = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: 'var(--card-background-color)',
        borderColor: state.isFocused ? 'var(--primary-color)' : 'var(--input-border-color)',
        boxShadow: `inset 0 1px 3px rgba(0, 0, 0, 0.1), 
                  12px 12px 12px rgba(0, 0, 0, 0.1),
                  -10px -10px 10px var(--input-glow)`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
        borderRadius: '4px',
        minHeight: '40px',
        fontSize: '0.98em',
        color: 'var(--text-color)',
        '&:hover': {
            borderColor: 'var(--primary-color)',
        }
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: 'var(--card-background-color)',
        border: '1px solid var(--input-border-color)',
        borderRadius: '4px',
        boxShadow: 'var(--card-shadow)',
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? 'var(--primary-color)' : 'var(--card-background-color)',
        color: state.isFocused ? '#fff' : 'var(--text-color)',
        padding: '10px',
        fontSize: '1em',
        transition: 'background-color 0.3s, color 0.3s',
        '&:hover': {
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
        },
    }),
    multiValue: (base: any) => ({
        ...base,
        backgroundColor: 'var(--tag-background-color)',
        padding: '2px 5px',
        color: 'var(--text-color)',
        borderRadius: '15px',
    }),
    multiValueLabel: (base: any) => ({
        ...base,
        color: 'var(--text-color)',
    }),
    multiValueRemove: (base: any) => ({
        ...base,
        color: '#fff',
        '&:hover': {
            backgroundColor: '#d93600',
            color: '#fff',
        },
    }),
    placeholder: (base: any) => ({
        ...base,
        color: 'var(--input-placeholder-color)',
    }),
    input: (base: any) => ({
        ...base,
        color: 'var(--text-color)',
    }),
};

export default customStyles;